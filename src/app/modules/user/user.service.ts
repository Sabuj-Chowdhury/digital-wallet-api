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
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userConstants } from "./user.constants";
import { Transaction } from "../transaction/transaction.model";
import {
  TransactionStatus,
  TransactionType,
} from "../transaction/transaction.interface";

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
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const userData = queryBuilder
    .filter()
    .search(userConstants)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    userData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
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

// get single user
const getSingleUser = async (slug: string, userSlug: string) => {
  const user = await User.findOne({ slug }).populate(
    "wallet",
    "balance status"
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found.");
  }

  if (userSlug !== user.slug) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can not see Other user information"
    );
  }
  return user;
};

// Add Money
const addMoney = async (payload: { amount: number }, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const amount = Number(payload?.amount);
    if (!amount || amount <= 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    }

    // wallet validation
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }
    if (wallet.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    wallet.balance += amount;
    await wallet.save({ session });

    await Transaction.create(
      [
        {
          type: TransactionType.ADD_MONEY,
          amount,
          fromUser: null,
          toUser: wallet.user,
          initiatedBy: wallet.user,
          status: TransactionStatus.COMPLETED,
          meta: { source: "self-topUp" },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// withdraw
const withdrawMoney = async (payload: { amount: number }, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const amount = Number(payload?.amount);
    if (!amount || amount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please, Provide a positive Number"
      );
    }

    // wallet validation
    const wallet = await Wallet.findOne({ user: userId });
    // console.log(wallet);

    if (!wallet) {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet not found");
    }

    if (wallet.status !== "ACTIVE") {
      throw new AppError(httpStatus.BAD_REQUEST, "Wallet is not active");
    }

    // Fee (10%)
    const fee = Math.ceil(amount * 0.1);
    const debit = amount + fee;

    if (wallet.balance < debit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    wallet.balance -= debit;
    await wallet.save({ session });

    await Transaction.create(
      [
        {
          type: TransactionType.WITHDRAW,
          amount,
          fee,
          fromUser: wallet.user,
          toUser: null,
          initiatedBy: wallet.user,
          status: TransactionStatus.COMPLETED,
          meta: { source: "self-withdrawal" },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return wallet;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// send money
const sendMoney = async (
  payload: { receiverId: string; amount: number },
  userId: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { receiverId, amount: rawAmount } = payload;
    const amount = Number(rawAmount);

    if (!receiverId)
      throw new AppError(httpStatus.BAD_REQUEST, "receiverId is required");
    if (!amount || amount <= 0)
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
    if (receiverId === userId)
      throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to self");

    // fetch wallets
    const senderWallet = await Wallet.findOne({ user: userId });
    const receiverWallet = await Wallet.findOne({ user: receiverId });

    if (!senderWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
    if (!receiverWallet)
      throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
    if (senderWallet.status !== "ACTIVE")
      throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet blocked");
    if (receiverWallet.status !== "ACTIVE")
      throw new AppError(httpStatus.BAD_REQUEST, "Receiver wallet blocked");

    // Fee (5%)
    const fee = Math.ceil(amount * 0.05);
    const debit = amount + fee;

    if (senderWallet.balance < debit)
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");

    // update balances
    senderWallet.balance -= debit;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    // create single transaction record (sender-side only)
    await Transaction.create(
      [
        {
          type: TransactionType.SEND_MONEY,
          amount,
          fee,
          fromUser: senderWallet.user,
          toUser: receiverWallet.user,
          initiatedBy: senderWallet.user,
          status: TransactionStatus.COMPLETED,
          meta: { method: "Send Money" },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { senderWallet, receiverWallet, fee };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// user wallet status update => admin
const blockWallet = async (userId: string, status: WalletStatus) => {
  const user = await User.findById(userId).populate(
    "wallet",
    "_id balance status"
  );

  // console.log(user);
  if (!user || user.role !== "USER") {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const updateUser = user.wallet as JwtPayload;

  updateUser.status = status;
  await updateUser.save();
  return user;
};

// get my profile
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  addMoney,
  withdrawMoney,
  sendMoney,
  blockWallet,
  getMe,
};
