import { User } from "../models/user.models.js";
import {projectMember} from "../models/projectmember.models.js"
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    //add other error configurations too.
    throw new ApiError(401, "Invalid access token");
  }
});


export const validateProjectPermission = (roles = []) =>{
 return asyncHandler(async(req, res , next) => {
    const {projectId} = req.params
    
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid project ID");
    }

    const membership = await projectMember.findOne({
      project : new mongoose.Types.ObjectId(projectId),
      user : new mongoose.Types.ObjectId(req.user._id) 
    })
    if(!membership){
      throw new ApiError(404, "Project not found or access denied")
    }

    req.user.role = membership.role;

    if(!roles.includes(membership.role)) {
        throw new ApiError('403', "You don not have permission to perform this action.")
    }

    next();
  })
}



