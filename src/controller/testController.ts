import express, { Request, Response, NextFunction} from 'express';
import {UserService} from '../service/userService';
import {User} from '../entity/User';
import { Result } from '../customType/express';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService("toodle1");
    try{
        const user: User[] | undefined = await userService.getAllUser();
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            user: user
        };
    }
    catch(err){
        console.log(err);

        if(err instanceof Error){
            req.result = {
                status: -1,
                message: err.message,
            };
        }
    }
    finally{
        res.send(req.result);
    }
}

export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService("toodle1");
    try{
        const newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.nickname = req.body.nickname;
        newUser.password = req.body.password;
        newUser.terms_and_agreement = req.body.terms;
        
        const user: User | undefined = await userService.insertUser(newUser);
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            user: [user]
        };
    }
    catch(err){
        console.log("여기야여기", req.body.name);
        console.log(err);
    
        if(err instanceof Error){
            req.result = {
                status: -2,
                message: err.message,
            };
        }
    }
    finally{
        res.send(req.result);
    }
}