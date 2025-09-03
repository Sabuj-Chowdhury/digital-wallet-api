import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { envVariable } from "../config/enVariable";
import { IUser, Role } from "../modules/user/user.interface";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ role: "ADMIN" });
    if (isAdminExist) {
      console.log("Admin already exist");
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVariable.ADMIN_PASSWORD,
      Number(envVariable.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      phone: "01717232757",
      email: envVariable.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,

      slug: "",
    };

    const admin = await User.create(payload);
    console.log("Admin created successfully!! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
