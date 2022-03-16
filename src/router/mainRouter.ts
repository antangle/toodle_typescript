import express, { Request, Response, NextFunction, query } from 'express';
import testHello from '../model/test/testHello';
import userRouter from '../model/user/userRouter';
const mainRouter = express.Router();

mainRouter.get('/', testHello);

//user
mainRouter.use('/user', userRouter);



export = mainRouter;