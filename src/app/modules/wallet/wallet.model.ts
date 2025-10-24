import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

export const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    balance: { type: Number, default: 50, min: 0 },
    cashIn: { type: Number, min: 0 },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
