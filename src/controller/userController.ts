import express, { Request, Response, NextFunction} from 'express';
import {UserService} from '../service/userService';
import {User} from '../entity/user.entity';
import { Result } from '../customType/express';
import { Consts_typeorm as ConstsTypeorm } from '../const/typeormConst';

//simple CRUD

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService(ConstsTypeorm.TYPEORM_CONNECTION_NAME);
    try{
        const user: User[] | undefined = await userService.getAllUser();
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            data: user
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
    const userService = new UserService(ConstsTypeorm.TYPEORM_CONNECTION_NAME);
    try{
        //parse req input into User - todo: make validation middleware
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.nickname = req.body.nickname;
        newUser.password = req.body.password;
        newUser.terms_and_agreement = req.body.terms;
        
        const user: User | undefined = await userService.insertUser(newUser);
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            data: [user]
        };
    }
    catch(err){
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

export const updateUserNickname = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService(ConstsTypeorm.TYPEORM_CONNECTION_NAME);
    try{
        //parse req input into User - todo: make validation middleware
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.nickname = req.body.nickname;
        var password = req.body.password;
        
        //verification


        //update
        const user: User | undefined = await userService.updateUser(newUser);
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            data: [user]
        };
    }
    catch(err){
        console.log(err);
    
        if(err instanceof Error){
            req.result = {
                status: -3,
                message: err.message,
            };
        }
    }
    finally{
        res.send(req.result);
    }
}


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userService = new UserService(ConstsTypeorm.TYPEORM_CONNECTION_NAME);
    try{
        //parse req input into User - todo: make validation middleware
        const newUser = new User();
        newUser.username = req.body.username;
        
        var password = req.body.password;
        //verification?

        const user: User | undefined = await userService.deleteUser(newUser);
        if(!user) throw Error;
        
        req.result = {
            status: 1,
            data: [user]
        };
    }
    catch(err){
        console.log(err);
    
        if(err instanceof Error){
            req.result = {
                status: -3,
                message: err.message,
            };
        }
    }
    finally{
        res.send(req.result);
    }
}