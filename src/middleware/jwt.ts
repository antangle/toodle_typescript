import { errCatcher, errCode } from './errorHandler';
import consts from '../const/consts';
import { UserService } from './../model/user/userService';
import { JwtResult } from './../interface/interfaces';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../error/customError';
import { UserDTO } from '../dto/userDto';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { makeApiResponse } from '../util/responseHandler';

const secret: string | undefined = process.env.JWT_SECRET;

//sign new jwt
export const sign = (user: UserDTO) => {
    
    const payload = {
        role: user.role,
        userId: user.id
    };
    
    //set access, refresh Token
    const accessToken: string = jwt.sign(payload, secret!, {
        expiresIn: consts.ACCESS_TOKEN_EXP_TIME
    });
    const refreshToken: string = jwt.sign({email: user.email}, secret!, {
        expiresIn: consts.REFRESH_TOKEN_EXP_TIME
    });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}

//check jwt tokens in cookies, then resign token.
const verifyUnwrap = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService(consts.TYPEORM_CONNECTION_NAME);
    if(!req.cookies.accessToken && !req.cookies.refreshToken) 
        throw new CustomError(errCode(req.pos!, consts.NO_TOKEN_CODE), consts.NO_TOKEN_STR);

    const secret: string | undefined = process.env.JWT_SECRET;

    //refresh token flow: need to send email in body!
    if(!req.cookies.accessToken){
        const token = req.cookies.refreshToken;
        const decoded: JwtResult = verifyToken(token);
        if(decoded.isvalid){
            //check with database
            const user = await userService.getRefreshToken(decoded.payload!);
            if(!user) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);

            //if refreshToken does not match, then throw
            if(user.refreshToken != token) throw new CustomError(errCode(req.pos!, consts.INVALID_TOKEN_CODE), consts.INVALID_TOKEN_STR);
            const newToken: string = jwt.sign({userId: decoded.payload!.userId}, secret!, {
                expiresIn: consts.REFRESH_TOKEN_EXP_TIME
            });
            req.userId = user.id;
            //do i have to resign refresh token..?
            res.cookie(consts.REFRESHTOKEN, newToken, {path: '/', httpOnly: true});
            next();
        } 
        //if invalid, send with err
        else throw new CustomError(errCode(req.pos!, consts.INVALID_TOKEN_CODE), consts.INVALID_TOKEN_STR);
    }
    //access token flow
    else{
        const token = req.cookies.accessToken;
        const decoded: JwtResult = verifyToken(token);
        
        //if token is valid, then sign new cookie, and pass
        if(decoded.isvalid){
            const newToken: string = jwt.sign(decoded.payload!, secret!, {
                expiresIn: consts.ACCESS_TOKEN_EXP_TIME
            });
            req.userId = decoded.payload!.userId;
            res.cookie(consts.ACCESSTOKEN, newToken, {path: '/', httpOnly: true});
            next();
        }
        //if invalid, send with err
        else if(decoded.refresh){
            //ask frontend to give refresh token!
            res.send(makeApiResponse(errCode(req.pos!, consts.REFRESH_TOKEN_REQUEST), consts.REFRESH_TOKEN_REQUEST_STR));
        }
        else throw new CustomError(consts.INVALID_TOKEN_CODE, consts.INVALID_TOKEN_STR);
    }
}



//parse jwtToken, then verifies it.
const verifyToken = (token: string): JwtResult => {
    //we have to check refresh token if token is expired. so use try / catch on this one!
    let result: JwtResult;
    try{
        const {userId, role} = jwt.verify(token, secret!) as jwt.JwtPayload;
        result = {
            isvalid: true,
            refresh: false,
            payload: {
                userId: userId,
                role: role
            }
        }
    } 
    catch(err){
        //expired token
        if(err instanceof TokenExpiredError){
            result = {
                isvalid: false,
                refresh: true,
            }
        }
        //invalid token
        else {
            result = {
                isvalid: false,
                refresh: false,
            }
        }
    }
    return result;
}

export const verify = errCatcher(verifyUnwrap);
