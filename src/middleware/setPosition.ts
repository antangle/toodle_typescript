import { Request, Response, NextFunction, ErrorRequestHandler} from 'express';

export const setpos = (pos: number) => (req:Request, res:Response, next:NextFunction) => {
    req.pos = pos;
    next();
}