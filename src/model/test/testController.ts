import { verify } from './../../middleware/jwt';
import { AuthController } from './../auth/authController';
import { errCatcher } from './../../middleware/errorHandler';
import { Router } from 'express';
import { CustomError } from '../../error/customError';
import { IController } from '../../interface/interfaces';
import express, { Request, Response, NextFunction} from 'express';
import { setpos } from '../../middleware/setPosition';

export class TestController implements IController{
    public url: string;
    public router: Router;
    constructor(url: string){
        this.url = url;
        this.router = Router();
        this.routes();
    }
    public routes(){
        this.router.use('/', setpos(900), verify, errCatcher(this.testHello));
    }
    public testHello(req:Request, res:Response, next:NextFunction){
        //throw new CustomError(1, "you did it!");
        console.log(req.pos);
        res.send("hello World!");
    }
}