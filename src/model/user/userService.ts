import { errCatcher } from './../../middleware/errorHandler';
import { JwtPayload } from 'jsonwebtoken';
import { JwtResult } from './../../interface/interfaces';
import { CustomError } from './../../error/customError';
import { UserDto } from './../../dto/userDto';
import express, { Request, Response, NextFunction} from 'express';
import { Connection, getConnection, getCustomRepository, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import {UserRepository} from './userRepository';
import consts from '../../const/consts';

export class UserService{
    //repository
    userRepository : UserRepository
    
    constructor(connectionName: string){
        //get new connection
        this.userRepository = getConnection(connectionName).getCustomRepository(UserRepository);
    }
    
    async save(user: User):Promise<User | undefined>{
        return this.userRepository.save(user);
    }
    
    //find all users
    async getAllUser(): Promise<User[] | undefined>{    
        const result: User[] | undefined = await this.userRepository.findAll();
        return result;
    }
    
    //for checking if username exists   
    async getEmail(user: UserDto): Promise<boolean> {
        const result: User | undefined = await this.userRepository.findOne({email: user.email});
        return !!result;
    }
    
    async getRefreshToken(payload: JwtPayload): Promise<User | undefined> {
        const userId = payload.userId;
        const result: User | undefined = await this.userRepository.findOne({id: userId});
        return result;
    }
    
    async getPasswordByEmail(user: UserDto): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.findOne({email: user.email});
        return result;
    }

    async saveRefreshToken(email: string, token: string): Promise<boolean>{
        const result = await this.userRepository.updateRefreshToken(email, token);
        return result;
    }
    
    //insert new user
    async insertUser(user: UserDto): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.save(user.toUserEntity());     
        return result;
    }
    
    //update nickname by username
    async updateUser(user: UserDto): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.updateNicknameByUsername(user.username, user.nickname);
        return result;
    }
    
    //delete user by username
    async deleteUser(user: UserDto): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.deleteUser(user.username);
        return result;
    }
}