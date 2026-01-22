import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const loginRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const registerRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const resetPasswordRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const verifyEmailRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const forgotPasswordRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const changePasswordRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})

export const apiRateLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 200,
    standardHeaders : true,
    legacyHeaders : false,
    message : "Too many requests from this IP, please try again after 15 minutes"
})
    