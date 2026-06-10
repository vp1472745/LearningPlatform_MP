import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin =
      await Admin.findOne({
        username: "admin",
      });

    if (existingAdmin) {
      console.log(
        "Admin already exists"
      );
      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    await Admin.create({
      name: "Super Admin",
      email:
        "admin@gmail.com",
      username: "admin",
      password:
        hashedPassword,
    });

    console.log(
      "Admin Created Successfully"
    );

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();