import { ApiError } from "../common/ApiError.js";
import { ApiResponse } from "../common/ApiResponse.js";
import Prisma from "../lib/Prisma.js";

export const createPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.id;
  // console.log(req.id);
  if (!tokenUserId) {
    return ApiError(res, 400, "User ID not found in request");
  }

  try {
    const newPost = await Prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: { create: body.postDetail },
      },
    });

    return ApiResponse(res, 200, newPost, "User created Successfully");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 500, "An error occurred while creating the post");
  }
};

// get All Post
export const getPosts = async (req, res) => {
  try {
    const postData = await Prisma.post.findMany({});
    return ApiResponse(res, 200, postData, "Post has been Fetched");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 404, "Issue in findinf posts try after sometime");
  }
};

// get SinglePost on the basis of Id
export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: { username: true, avatar: true },
        },
      },
    });
    return ApiResponse(res, 200, post, "sucessfully find post");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 404, "post not found");
  }
};

// update post on the basis of id
export const updatePost = async () => {
  console.log("it update single post");
};

// delete post on the basis of id
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenuserId = req.id;

  try {
    const post = await Prisma.post.findUnique({ where: { id } });

    if (post.userId !== tokenuserId) {
      return ApiError(res, 404, "not authorized");
    }

    await Prisma.post.delete({ where: { id } });

    return ApiResponse(res, 200, null, "Post Deleted Successfully");
  } catch (error) {
    console.log(error.message);
    return ApiError(res, 404, "Post Cant be deleted");
  }
};
