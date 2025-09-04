import httpStatus from "http-status-codes";
import { Wallet } from "./wallet.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { walletConstants } from "./wallet.constants";
import AppError from "../../errorHelper/AppError";

// get Wallet
const getMyWallet = async (
  loginSlug: string,
  paramSlug: string,
  userId: string
) => {
  // slug check
  if (loginSlug !== paramSlug) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can not see other user's wallet"
    );
  }

  const wallet = await Wallet.findOne({ user: userId }).populate(
    "user",
    "name phone email role"
  );

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  return {
    wallet,
  };
};

// get all wallets
const getAllWallets = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Wallet.find(), query);

  const walletData = queryBuilder
    .filter()
    .search(walletConstants)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    walletData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const WalletServices = {
  getMyWallet,
  getAllWallets,
};
