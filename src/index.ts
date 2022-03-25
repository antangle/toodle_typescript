import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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
import { TYPEORM_CONNECTION_NAME } from './const/constants';

async function main(){
    await createConnection(config);

    const middlewares: any[] = [
        express.json(),
        express.urlencoded({extended: true}),
        cookieParser(),
        cors(),
    ];

    //instance container
    const userService = new UserService(TYPEORM_CONNECTION_NAME);
    const userController = new UserController('/user', userService);
    const authController = new AuthController('/auth', userService);
    const testController = new TestController('/test');
    
    const controllers: IController[] = [
        userController,
        authController,
        testController,
    ];

    const server = new Server(middlewares, controllers, globalErrorHandler);
    server.start();
}

main();