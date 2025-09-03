import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelper/AppError";
import { envVariable } from "../../config/enVariable";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { JwtPayload } from "jsonwebtoken";

// create user
const createUser = async (payload: Partial<IUser>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password, ...rest } = payload;

    // check existing user
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is Already Exist");
    }

    // hash password
    const hashPassword = await bcryptjs.hash(
      password as string,
      Number(envVariable.BCRYPT_SALT_ROUND)
    );

    // user create
    const user = await User.create(
      [
        {
          email,
          password: hashPassword,
          ...rest,
        },
      ],
      { session }
    );

    // wallet create
    const wallet = await Wallet.create(
      [
        {
          user: user[0]._id,
          balance: user[0].role === "ADMIN" ? 0 : 50,
          status:
            user[0].role === "USER" || user[0].role === "ADMIN"
              ? WalletStatus.ACTIVE
              : WalletStatus.APPROVED,
        },
      ],
      { session }
    );

    // update user with wallet reference
    const updateUser = await User.findByIdAndUpdate(
      user[0]._id,
      { wallet: wallet[0]._id },
      { new: true, runValidators: true, session }
    ).populate("wallet", "_id balance status");

    await session.commitTransaction();
    session.endSession();
    return updateUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all user ->ADMIN
const getAllUsers = async () => {
  const users = await User.find({ role: "USER" }).populate(
    "wallet",
    "_id balance status"
  );
  const totalUsers = await User.countDocuments({ role: "USER" });

  return {
    meta: {
      total: totalUsers,
    },
    users: users,
  };
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserIdExist = await User.findById(userId);

  if (!ifUserIdExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // password hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVariable.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
};
