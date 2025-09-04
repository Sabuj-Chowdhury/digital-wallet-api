import AppError from "../../errorHelper/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { transactionConstants } from "./transaction.constant";
import { Transaction } from "./transaction.model";
import httpStatus from "http-status-codes";

const getAllTransactions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);

  const transactionData = queryBuilder
    .filter()
    .search(transactionConstants)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactionData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getMyTransactions = async (
  loginSlug: string,
  paramSlug: string,
  userId: string,
  query: Record<string, string>
) => {
  // slug check
  if (loginSlug !== paramSlug) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can not see other user's transactions"
    );
  }

  const filter = {
    $or: [{ fromUser: userId }, { toUser: userId }],
  };

  const queryBuilder = new QueryBuilder(Transaction.find(filter), query);
  const transactionData = queryBuilder
    .filter()
    .search(transactionConstants)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    transactionData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

export const TransactionService = {
  getMyTransactions,
  getAllTransactions,
};
