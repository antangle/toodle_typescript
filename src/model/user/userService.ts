import { CustomError } from './../../error/customError';
import { UserDTO } from './../../dto/userDTO';
import express, { Request, Response, NextFunction} from 'express';
import { Connection, getConnection, getCustomRepository, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import {UserRepository} from './userRepository';

export class UserService{
    //repository
    userRepository : UserRepository
    
    constructor(connectionName: string){
        //get new connection
        this.userRepository = getConnection(connectionName).getCustomRepository(UserRepository);
    }
    
    //find all users
    async getAllUser(): Promise<User[] | undefined>{    
        const result: User[] | undefined = await this.userRepository.findAll();
        return result;
    }
    //for checking if username exists   
    async getUsername(user: UserDTO): Promise<boolean> {
        const result: User | undefined = await this.userRepository.findPasswordByUsername(user.username);
        return !!result;
    }

    async getPasswordByUsername(user: UserDTO): Promise<string>{
        const result: User | undefined = await this.userRepository.findPasswordByUsername(user.username);
        if(!result) throw new CustomError(-2011, 'user does not exist');
        return result.password!;
    }

    async saveRefreshToken(username: string, token: string): Promise<boolean>{
        const result = await this.userRepository.updateRefreshToken(username, token);
        return result;
    }
    //insert new user
    async insertUser(user: UserDTO): Promise<User | undefined>{
        const result: [User] | undefined = await this.userRepository.saveUser(user);     
        if(!result) throw new CustomError(-1021, 'user does not exist');
        delete result[0].password
        return result[0];
    }
    
    //update nickname by username
    async updateUser(user: UserDTO): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.updateNicknameByUsername(user.username, user.nickname);
        if(!result) throw new CustomError(-1031, 'user does not exist');
        return result;
    }
    
    //delete user by username
    async deleteUser(user: UserDTO): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.deleteUser(user.username);
        if(!result) throw new CustomError(-1041, 'user does not exist');
        return result;
    }
}