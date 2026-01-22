import jwt from "jsonwebtoken";

const blacklistedToken = new Map();

export const blacklistToken = (token) => {
    try{
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = verify?.exp ? verify.exp * 1000 : Date.now() + 60 * 60 * 1000;
        const ttl = Math.max(expiresAt - Date.now(), 0);

        if(ttl <= 0){
            blacklistedToken.delete(token);
            return;
        }
        const existingTTL = blacklistedToken.get(token);
        if(existingTTL){
            clearTimeout(existingTTL);
        }
        const timer = setTimeout(() => {
            blacklistedToken.delete(token);
        }, ttl);
        blacklistedToken.set(token, timer);
    }catch(error){
        throw(error);
    }
}

export const isBlacklisted = (token) => {
    return blacklistedToken.has(token);
}