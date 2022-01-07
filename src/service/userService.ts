import express, { Request, Response, NextFunction} from 'express';
import { connect } from 'net';
import {Connection, getConnection, getCustomRepository, Repository} from "typeorm";
import { User } from '../entity/User';
import {UserRepository} from '../repository/userRepository';

export class UserService{
    //repository 선언
    userRepository : UserRepository
    
    constructor(connectionName:string){
        //get new connection
        this.userRepository = getConnection(connectionName).getCustomRepository(UserRepository)
    }
    
    //find all users
    async getAllUser(): Promise<User[] | undefined>{    
        const result: User[] | undefined = await this.userRepository.findAll()
        return result;
    }

    //insert a User
    async insertUser(user: User): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.save(user);     
        return result;
    }
}