import mongoose , { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"




const userSchema = new Schema(
    {
        avatar : {
            type: {
                url : String,
                localPath : String,

            },
            default : {
                url : `https://placehold.co/200x200`,
                localPath: "" 
            }
        },
        username : {
            type :  String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index: true,

        },
        email : {
            type: String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullName : {
            type : String,
            trim : true
        },
        password : {
            type : String,
            required : [true, "Password is required"]
        },
        isEmailVerified : {
            type : Boolean,
            default : false
        },
        refreshToken : {
            type : String
        },
        forgotPasswordToken : {
            type : String
        } ,  // can be present in DB forver so need to consider that as well.
        forgotPasswordExpiry : {
                type : Date
        },
        emailVerificationToken : {
            type : String
        },
        emailVerificationExpiry : {
            type : Date
        }
    }, {
        timestamps : true  // we have timeseries as well and in timestamps two more fields are there - createdAt and updatedAt
    }

) 
// NOTE : schema further can have hooks and methods written in other file.
// userSchema.pre("save", async function(next){
//     if(!this.isModified("password"))  return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// }) 

// async function automatically ek Promise return karta hai, jisse Mongoose ko pata chal jata hai ki task kab complete hua. Agar async ke sath next() bhi call hoga, toh same hook do baar execute ho jayega (double execution) aur errors produce honge. Isiliye Mongoose async hooks mein next parameter pass hi nahi karta taaki single-execution aur proper error handling bani rahe.
// ✅ SO THIS IS THE Corrected VERSION OF ABOVE COMMENTED CODE.
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});
// it will keep on encrypting if someone changes the dp or pass some data. so we will put safeguarding mechanism using this.isModified("password") to check if password is modified or not. If it is modified then only encrypt it otherwise not.

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password )
}

// generating tokens
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
          _id : this._id ,
          email: this.email,
          username : this.username
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username
        // incase of refresh token we don't provide payload in it as we provide in access token.
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}
// for without data token we use crypto module of node js 
userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken =  crypto.createHash("sha256")
    .update(unHashedToken)
    .digest("hex")

    const tokenExpiry = Date.now() + 20 * 60 * 1000 // 10 minutes
    return {
        unHashedToken,
        hashedToken,
        tokenExpiry
    }
}

export const User = mongoose.model("User", userSchema) // it will be converted to lowercase and user will be converted to users - the plural form.