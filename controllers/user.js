import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../Utils/features.js";
import ErrorHandler from "../middlewares/error.js";

// export const getAllUsers = async (req, res, next) => {};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invaild email or password", 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invaild email or password", 400));

    sendCookie(user, res, `welcome back ${user.name}`);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // console.log("Incoming Request Body:", req.body);
    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User already exits", 400));

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    sendCookie(user, res, "Registered Successfully !!", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  try {
    // console.log(decoded._id);

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Development" ? false : true,
      })
      .json({
        success: true,
        user: req.user,
      });
  } catch (error) {
    next(error);
  }
};