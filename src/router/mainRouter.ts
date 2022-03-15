import express, { Request, Response, NextFunction, query } from 'express';
import testHello from '../controller/testHello';
import userRouter from './userRouter';
const mainRouter = express.Router();

mainRouter.get('/', testHello);

//user
mainRouter.use('/user', userRouter);



export = mainRouter;