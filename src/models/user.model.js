

import {mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";

const userSchema = new Schema(

    {
        username: {
            type: String,
            lowercase: true,
            required: [true, "useranme can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        fullName: {
            type: String,
            trim: true,
            index: true,
            trim: true
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

//to decrypt and save the password in db
//done before saving into db
//using pre hook and save middleware

// userSchema.pre('save',async function(next) {
//     if(!this.isModified('password')) return next()
//      this.password =  bcrypt.hash(this.password,12)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(this.password,password)
// }

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken  = function(){
    
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username : this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken  = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)