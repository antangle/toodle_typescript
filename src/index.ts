import { KakaoController } from './model/auth/OauthController';
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
import consts from './const/consts';

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
    const userController = new UserController('/user', userService);
    const authController = new AuthController('/auth', userService);
    const testController = new TestController('/test');
    const kakaoController = new KakaoController('/oauth/kakao', userService);

    const controllers: IController[] = [
        userController,
        authController,
        testController,
        kakaoController,
    ];

    const server = new Server(middlewares, controllers, globalErrorHandler);
    server.start();
}

main();