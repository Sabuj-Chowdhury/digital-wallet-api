import { model, Schema } from "mongoose";
import {
  ITransaction,
  TransactionStatus,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    toUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.COMPLETED,
    },
    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
