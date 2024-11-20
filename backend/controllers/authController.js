import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function Signup(req, res){
    try {
        const {email, password, username} = req.body;

        if(!email || !password || !username) {
            return res.statust(400).json({success:false,message:"All fields are required"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false, message:"Invalid email"})
        }

        if(password.length < 6){
            return res.status(400).json({success:false, message:"Password must be at least 6 characters"})
        }

        const existingUserByEmail = await User.findone({email:email})

        if(existingUserByEmail){
            return res.status(400).json({success:false, message:"Email already exists"})
        }

        const existingUserByUsername = await User.findone({username:username})

        if(existingUserByUsername){
            return res.status(400).json({success:false, message: "Username already exists"})
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const image = PROFILE_PICS[Math.floor(Math.random * PROFILE_PICS.length)];

        const newUser = new User({
            email, 
            password: hashedPassword,
            username,
            image 
        });

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        // remove password from response
        res.status(201).json({
            success: true, 
            user: {
                ...newUser._doc,
                password:"",
            },
        });


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function Login(req, res){
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        const user = await User.findone({email : email})

        if(!user) {
            return res.status(404).json({success: false, message: "Invalid Credentials"});
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(404).json({success: false, message: "Invalid Credentials"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true, 
            user: {
                ...user._doc,
                password: ""
            }
        })

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function Logout(req, res){
    try {
        res.clearCookie("jwt-catflix");
        res.status(200).json({success: true, message: "logged out"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({success : false, message: "Internal server error"});
    }
}