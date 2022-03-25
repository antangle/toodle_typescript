import { errCatcher } from './../../middleware/errorHandler';
import { Router } from 'express';
import { CustomError } from '../../error/customError';
import { IController } from '../../interface/interfaces';
import express, { Request, Response, NextFunction} from 'express';
import { verify } from '../../middleware/jwt';

export class TestController implements IController{
    public url: string;
    public router: Router;
    constructor(url: string){
        this.url = url;
        this.router = Router();
        this.routes();
    }
    public routes(){
        this.router.use('/', verify, errCatcher(this.testHello));
    }
    public testHello(req:Request, res:Response, next:NextFunction){
        //throw new CustomError(1, "you did it!");
        res.send("hello World!");
    }
}