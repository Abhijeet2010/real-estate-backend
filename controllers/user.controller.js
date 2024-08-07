import { ApiError } from "../common/ApiError.js";
import { ApiResponse } from "../common/ApiResponse.js";
import Prisma from "../lib/Prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  const allUsers = await Prisma.user.findMany();
  return ApiResponse(res, 200, allUsers, "Successfully find all users");
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const userData = await Prisma.user.findUnique({
      where: { id },
    });

    return ApiResponse(res, 200, userData, "user found successfully");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 404, "user not found");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;

  console.log(id, userId);

  if (userId !== id) {
    return ApiError(res, 402, "Not Authorized!");
  }

  const { password, avatar, ...otherFields } = req.body;

  try {
    let updatedHashPassword;
    if (password) {
      updatedHashPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await Prisma.user.update({
      where: { id },
      data: {
        ...otherFields,
        ...(updatedHashPassword && { password: updatedHashPassword }),
        ...(avatar && { avatar }),
      },
    });

    return ApiResponse(res, 200, updatedUser, "User updated successfully");
  } catch (error) {
    return ApiError(res, 404, "Technical issue, user not updated");
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await Prisma.user.delete({
      where: { id },
    });
    return ApiResponse(res, 200, null, "user Deleted Successfully");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 402, "unable to delete user right now!");
  }
};
