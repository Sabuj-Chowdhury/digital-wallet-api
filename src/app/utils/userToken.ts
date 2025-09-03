import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";
import { envVariable } from "../config/enVariable";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
    slug: user.slug,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariable.JWT_ACCESS_SECRET,
    envVariable.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};
