
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../utils/jwt";

export function verifyToken(req: Request, res: Response, next){
    const token = req.headers.authorization.split(' ')[1];
    try {
        const user = verify(token, secret);
        res.locals.user = user;
        next();
    } catch (error) {
        res.status(401).send('Invalid Token');
    }
}

