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
    private routes(){
        this.router.use('/loginPage', setpos(901), errCatcher(this.loginPage));
        this.router.use('/kakaoLoginPage', setpos(902), errCatcher(this.kakaoLoginPage));
        this.router.use('/paymentPage', setpos(903), errCatcher(this.paymentPage));
        this.router.use('/localLoginPage', setpos(903), errCatcher(this.localLoginPage));
        this.router.use('/test', setpos(905), verify, errCatcher(this.testHello));
        this.router.use('/', setpos(900), errCatcher(this.mainPage));
    }
    private mainPage(req:Request, res:Response, next:NextFunction){
        res.render('mainPage');
    }
    private loginPage(req:Request, res:Response, next:NextFunction){
        res.render('login');
    }
    private localLoginPage(req:Request, res:Response, next:NextFunction){
        res.render('localLogin');
    }
    private kakaoLoginPage(req:Request, res:Response, next:NextFunction){
        res.render('kakaoLogin');
    }
    private paymentPage(req:Request, res:Response, next:NextFunction){
        res.render('payment');
    }
    private testHello(req:Request, res:Response, next:NextFunction){
        //throw new CustomError(1, "you did it!");
        console.log(req.pos);
        console.log(req.userId);
        res.send("hello World!");
    }
}