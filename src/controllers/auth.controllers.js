import {User} from '../models/user.models.js'
import {ApiResponse} from '../utils/api-response.js'
import {ApiError} from '../utils/api-error.js'
import {asyncHandler} from '../utils/async-handler.js'
import {emailVerficationMailgenContent,forgotPasswordMailgenContent,sendEmail} from "../utils/mail.js"
import jwt from "jsonwebtoken";
import crypto from "crypto"
const generateAccessAndRefreshToken = async (userId) => {
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})
        // we are saving the refresh token in the database so that we can verify it when user sends it to us for generating new access token.
       return {accessToken, refreshToken}

    }catch(error){
            // console.log(error)
            throw new ApiError(500, "Something went wrong")
    }


}
const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password , role} = req.body

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists", [])
    }

   const user = await User.create({
        email,
        password,
        username,
        isEmailVerified : false
    })

   const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken
   user.emailVerificationExpiry = tokenExpiry
   await user.save({validateBeforeSave: false})
   await sendEmail({
    email : user?.email,
    subject : "Please verify your email",
    mailgenContent : emailVerficationMailgenContent(user.username,
         `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
   });

   const createdUser = await User
   .findById(user._id)
   .select(
    "-password -refreshToken -emailVerficationToken -emailVerificationExpiry"
   )//things i want to haveeeee

   if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering a user")
   }
   return res.status(201).json(
    new ApiResponse(200, 
        {user: createdUser},
        "User registered successfully. Please check your email to verify your account."
   ))
})



const login = asyncHandler(async (req, res) => {
   const { email, password ,username} = req.body

   if( !username || !email){
    throw new ApiError(400, "email is required");
    
}

const user = await User.findOne({email})
if (!user) {
    throw new ApiError(400, "User does not exist");
    
   }

   const isPasswordCorrect = await user.isPasswordCorrect(password)

   if (!isPasswordCorrect){
     throw new ApiError(400, "Invalid Credentials");
   }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
  const loggedInUser = await User
   .findById(user._id)
   .select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
   )//things i am not wanting to xhave
   console.log( user.emailVerificationExpiry)
    const options = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in sucessfully"
        )
    )
})


const logoutUser = asyncHandler(async (req, res, next) => {
   await User.findByIdAndUpdate(
        req.user._id, // request m joh user h uski id lelo
        {
            $set:
            {
                refreshToken:""
            }
        },
        {
            new:true // give the most update and newest object
        }
    );
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"  
        )
    )
})

const verifyEmail = asyncHandler(async (req, res) => {
   const {verificationToken}  = req.params
    console.log(verificationToken)
   if(!verificationToken){
        throw new ApiError(400, "Email verification token is missing")

   }
   let hashedToken = crypto
                    .createHash("sha256")
                    .update(verificationToken)
                    .digest("hex")

    const user = await User.findOne({
        emailVerificationToken : hashedToken,
        emailVerificationExpiry : { $gt :new Date()}
    })
    console.log("1. Postman Param Token:", verificationToken);
    console.log("2. Generated Hash to search in DB:", hashedToken);
    if (!user){
        throw new ApiError(400, "Token is invalid or expired");
    }
    user.emailVerificationToken = undefined
    user.emailVerificationExpiry = undefined
    user.isEmailVerified = true
    await user.save({validateBeforeSave : false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified:true
                },

                "Email is verified"
            )
        )

})
//we can access the value from the body and now we will access it from the url itself.
const resendEmailVerification = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(404, "User does not exist")
    }
    if(user.isEmailVerified){
        throw new ApiError(409, "Email is already verified.")
    }

    //send email again for verification
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

   user.emailVerificationToken = hashedToken
   user.emailVerificationTokenExpiry = tokenExpiry
   await user.save({validateBeforeSave: false})
   await sendEmail({
    email : user?.email,
    subject : "Please verify your email",
    mailgenContent : emailVerficationMailgenContent(user.username,
         `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
   });

   return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to you email ID."
            )
        )
})

const refreshAccessToken = asyncHandler( async ( req, res) => {
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshAccessToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized access")
    }
    try{
       const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
       
       const user = await User.findById(decodedToken?._id);
       if(!user){
        throw new ApiError(401, "Invalid refresh token")
       }
       if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired")
       }
       const options = {
            httpOnly:true,
            secure:true
       }
       const {accessToken , refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user._id)
       user.refreshToken = newRefreshToken
       await user.save()

       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
          new ApiResponse(
            200,
            {
               accessToken, refreshToken: newRefreshToken 
            },
            "Access token refreshed"

         )
       )

    }catch(error){

            throw new ApiError(401, "Invalid  Refresh token")

    }
})


//FORGOT PASSWORD
const forgotPasswordRequest = asyncHandler ( async(req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
            throw new ApiError(401, "User does not exist", [])
    }
    const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken()

    user.forgotPasswordToken = hashedToken
    user.forgotPasswordExpiry = tokenExpiry

    user.save({validateBeforeSave: false})

    await sendEmail({
    email : user?.email,
    subject : "Password reset request",
    mailgenContent : forgotPasswordMailgenContent(
        user.username,
        //  `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}` 
         `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}` 
         //can be done in either ways
        )

    })
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password reset mail has been sent to your mail"
        )
    )

})


//RESETTING THE PASSWORD

const resetForgotPassword = asyncHandler(async(req, res) => {

    const {resetToken} = req.params
    const {newPassword} = req.body

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken : hashedToken,
        forgotPasswordExpiry : {$gt: Date.now()}
    })
    if(!user){
        throw new ApiError(400, "Token is invalid or expired");
        
    }
    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined
    user.password= newPassword

    await user.save({validateBeforeSave:false})
    return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            {
                // password:newPassword
            },
            "Password has been succesfully reset."
        )
        )
})


const changeCurrentPassword = asyncHandler(async(req, res) => {

    const { oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Old password ");
        
    }
    user.password = newPassword

    await user.save({validateBeforeSave:false})
    return res
        .status(200)
        .json(
            new ApiResponse(
            200,
            {
                // password:newPassword
            },
            "Password has been succesfully changed.")
        )
})

export {
    registerUser,
    login,
    logoutUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    getCurrentUser,
    changeCurrentPassword
};