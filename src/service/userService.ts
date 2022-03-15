import express, { Request, Response, NextFunction} from 'express';
import { Connection, getConnection, getCustomRepository, Repository } from "typeorm";
import { User } from '../entity/user.entity';
import {UserRepository} from '../repository/userRepository';

export class UserService{
    //repository
    userRepository : UserRepository
    
    constructor(connectionName:string){
        //get new connection
        this.userRepository = getConnection(connectionName).getCustomRepository(UserRepository);
    }
    
    //find all users
    async getAllUser(): Promise<User[] | undefined>{    
        const result: User[] | undefined = await this.userRepository.findAll();
        return result;
    }

    //insert a User
    async insertUser(user: User): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.save(user);     
        return result;
    }

    async updateUser(user: User): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.updateNicknameByUsername(user.username, user.nickname);
        return result;
    }

    async deleteUser(user: User): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.deleteUser(user.username);
        return result;
    }
}