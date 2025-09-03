import { User } from "../user/user.model";

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

export const AdminService = {
  getAllUsers,
};
