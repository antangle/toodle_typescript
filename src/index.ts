import { ProductController } from './model/product/productController';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import config from './config/ormconfig';
import { Server } from './server';
import { createConnection } from 'typeorm';
import { IController } from './interface/interfaces';
import { globalErrorHandler } from './middleware/errorHandler';
import { UserService } from './model/user/userService';
import { AuthController } from './model/auth/authController';
import { TestController } from './model/test/testController';
import { UserController } from './model/user/userController';
import { KakaoController } from './model/auth/kakaoController';
import consts from './const/consts';
import { AuthService } from './model/auth/authService';
import { PaymentService } from './model/payment/paymentService';
import { PaymentController } from './model/payment/paymentController';
import { ProductService } from './model/product/productService';

async function main(){
    await createConnection(config);

    const middlewares: any[] = [
        express.json(),
        express.urlencoded({extended: true}),
        cookieParser(),
        cors(),
    ];

    //instance container
    const userService = new UserService(consts.TYPEORM_CONNECTION_NAME);
    const authService = new AuthService(consts.TYPEORM_CONNECTION_NAME);
    const paymentService = new PaymentService(consts.TYPEORM_CONNECTION_NAME);
    const productService = new ProductService(consts.TYPEORM_CONNECTION_NAME);
    const userController = new UserController('/user', userService);
    const authController = new AuthController('/auth', userService);
    const kakaoController = new KakaoController('/oauth/kakao', userService, authService);
    const paymentController = new PaymentController('/payment', paymentService, productService);
    const productController = new ProductController('/product', productService);
    const testController = new TestController('/');



    const controllers: IController[] = [
        userController,
        authController,
        kakaoController,
        paymentController,
        productController,

        //test should be last
        testController,
    ];

    const server = new Server(middlewares, controllers, globalErrorHandler);
    server.start();
}

main();