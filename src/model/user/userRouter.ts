import express, { Request, Response, NextFunction, query } from 'express';
import {getUser, insertUser, updateUserNickname, deleteUser} from './userController';

const userRouter = express.Router();

userRouter.get('/', getUser);
userRouter.post('/', insertUser);
userRouter.patch('/', updateUserNickname);
userRouter.delete('/', deleteUser);

export = userRouter;