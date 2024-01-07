const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = require("../utils/config");

router.get("/", (req, res) => {
  User.find({}, {}).then((user) => {
    res.status(200).json(user);
  });
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Password is correct - You can create a session or token for authentication here
    res.status(200).json({ message: "Sign in successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exits" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hasedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // const link = `http://localhost:3000/users/reset-password/${randomString}`;
    const link = `https://silly-meringue-e2f2a6.netlify.app/users/reset-password/${randomString}`;

    user.resetToken = randomString;
    const updateUser = await User.findByIdAndUpdate(user.id, user);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: `"Balaganesh S" <${EMAIL_ADDRESS}>`,
        to: user.email,
        subject: "Reset Password",
        text: `Kindly use this link to reset the password - ${link}`,
      });
    };
    sendMail()
      .then(() => {
        return res
          .status(201)
          .json({ message: `Mail has been sent to ${user.email}` });
      })
      .catch((err) => res.status(500).json(err));
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.patch("/reset-password/:id", async (req, res) => {
  try {
    const resetToken = req.params.id;
    const { password } = req.body;

    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(400).json({ Err: "user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetToken = "";

    await User.findByIdAndUpdate(user.id, user);

    res.status(201).json({
      message: "Password has been changed sucessfully",
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
