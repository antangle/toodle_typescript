import { jwtResult } from './../interface/interfaces';
import { InputError } from './../error/inputError';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../error/customError';
import { UserDTO } from '../dto/userDto';
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { makeApiResponse } from './responseHandler';

const secret: string | undefined = process.env.JWT_SECRET;

export const sign = (user: UserDTO) => {
    const payload = {
        username: user.username,
        role: user.role
    };
    
    //set access, refresh Token
    const accessToken: string = jwt.sign(payload, secret!, {
        algorithm: 'HS256',
        expiresIn: '24h'
    });
    return {
        accessToken: accessToken
    };
}

export const verify = (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.token) throw new CustomError(2041, "no token");
    const token = req.cookies.token;
    
    const decoded: jwtResult = verifyToken(token);
    //if token is valid, then pass
    if(decoded.isvalid) next();
    else res.send(makeApiResponse(204, "invalid token"));
    
}

//parse jwtToken, then verifies it.
export const verifyToken = (token: string): jwtResult => {
    //we have to check refresh token if token is expired. so use try / catch on this one!
    let result: jwtResult;
    try{
        const isVerified = jwt.verify(token, secret!);
        result = {
            isvalid: true,
            data: isVerified
        }
    } 
    catch(err){
        //expired token
        if(err instanceof TokenExpiredError){
            result = {
                isvalid: false,
            }
        }
        //invalid token
        else {
            result = {
                isvalid: false,
            }
        }
    }
    return result;
}