import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    phone: { type: String, required: true, unique: true },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      default: undefined,
      index: true,
    },
    email: { type: String, unique: true },
    password: { type: String },
    role: {
      type: String,
      default: Role.USER,
      enum: Object.values(Role),
    },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// create slug
userSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await User.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

// update slug
userSchema.pre("findOneAndUpdate", async function (next) {
  const user = this.getUpdate() as Partial<IUser>;

  if (user.name) {
    const baseSlug = user.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await User.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    user.slug = slug;
  }

  this.setUpdate(user);
  next();
});

export const User = model<IUser>("User", userSchema);
