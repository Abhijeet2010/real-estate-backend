import { ApiError } from "../common/ApiError.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  //   if no token get then return
  if (!token) return ApiError(res, 403, "User not Found");

  jwt.verify(token, "Abhijeet", async (err, payload) => {
    if (err) return ApiError(res, 404, "Not Authenticated");
    req.id = payload.id;
    next();
  });
};

export default verifyToken;
