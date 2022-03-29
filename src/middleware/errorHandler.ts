import { QueryFailedError } from 'typeorm';
import { Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { CustomError } from '../error/customError';

type MiddlewareInput = {(req: Request, res: Response, next: NextFunction): any};

export const errCode = (pos: number, errCode: number): number => {
    let code: string = "" + pos + Math.abs(errCode);
    return Math.sign(errCode) * parseInt(code);
}

export const errCatcher = (fn: MiddlewareInput) => (req: Request, res: Response, next: NextFunction) => { 
    return Promise.resolve(fn(req, res, next)).catch(next);
}

export const globalErrorHandler: ErrorRequestHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    console.log(req.pos!);
    if(err instanceof CustomError){
        console.log(errCode(req.pos!, err.statusCode));
    }
    else if (err instanceof JsonWebTokenError){
        console.log("something wrong with json token");
    }

    console.log(err);
    res.send("there was an error");
}