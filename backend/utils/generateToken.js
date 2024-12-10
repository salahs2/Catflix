import jwt from "jsonwebtoken"
import { ENV_VARS } from "../config/envVars.js"

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: '15d'});

    res.cookie("jwt-catflix", token, {
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in MS
        httpOnly: true,  // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSF attacks cross-site request forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development",
    });

    return token;
};
