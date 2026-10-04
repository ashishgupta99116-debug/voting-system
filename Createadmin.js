
require("dotenv").config();

const mongoose = require("mongoose");
require("./db"); // Reuse the existing MongoDB connection

const User = require("./model/user");

const createAdmin = async () => {
  try {
    // Wait until MongoDB is connected
    await mongoose.connection.asPromise();

    // Check whether an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("An admin already exists. No new admin created.");
      return;
    }

    // Create the admin
    const admin = new User({
      name: process.env.ADMIN_NAME,
      age: Number(process.env.ADMIN_AGE),
      email: process.env.ADMIN_EMAIL,
      mobilenumber: process.env.ADMIN_MOBILE,
      address: process.env.ADMIN_ADDRESS,
      aadhaarcardnumber: process.env.ADMIN_AADHAAR,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isVoted: false
    });

    await admin.save();

    console.log("Admin created successfully!");
  } catch (error) {
    console.error("Admin creation failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();