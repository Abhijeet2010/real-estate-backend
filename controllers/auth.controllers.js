import { ApiError } from "../common/ApiError.js";
import { ApiResponse } from "../common/ApiResponse.js";
import Prisma from "../lib/Prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check validation about user availablity in db
    const isUserAvailable = await Prisma.user.findUnique({
      where: { email },
    });
    // if user present in db then throw error
    if (isUserAvailable) return ApiError(res, 409, "User Already Exists");

    // if user is new then hash password 1st
    const hashPassword = await bcrypt.hash(password, 10);

    // save the user

    const newUser = await Prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    return ApiResponse(res, 200, null, "User Registerd Successfully");
  } catch (error) {
    console.log(error);
    return ApiError(res, 500, error.message, "Something Went Wrong");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user exist or not in db
    const isUserExist = await Prisma.user.findUnique({ where: { email } });

    // if user is not there then throww error
    if (!isUserExist)
      return ApiError(res, 403, "Invalid Credentials Or User not Found");

    // verify hashPassword with original password

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist.password
    );

    // if password is wrong then return error invalid credentials
    if (!isPasswordCorrect) return ApiError(res, 403, "Invalid Credentials!!!");

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: isUserExist.id,
        email: isUserExist.email,
        username: isUserExist.username,
      },
      "Abhijeet",
      { expiresIn: age }
    );
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // Uncomment this if you're using HTTPS
      maxAge: age,
    });

    const { password: undefiend, ...userData } = isUserExist;
    return ApiResponse(res, 200, userData, "Login Successfull");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 500, error, "user not LoggedIn");
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  return ApiResponse(res, 200, null, "Logout Successfully");
};
