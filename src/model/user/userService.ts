import { JwtPayload } from 'jsonwebtoken';
import { JwtResult } from './../../interface/interfaces';
import { CustomError } from './../../error/customError';
import { UserDTO } from './../../dto/userDTO';
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
    async getRefreshToken(payload: JwtPayload): Promise<User | undefined> {
        const username = payload.username;
        const result: User | undefined = await this.userRepository.findOne({username: username});
        return result;
    }
    async getPasswordByUsername(user: UserDTO): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.findPasswordByUsername(user.username);
        return result;
    }

    async saveRefreshToken(username: string, token: string): Promise<boolean>{
        const result = await this.userRepository.updateRefreshToken(username, token);
        return result;
    }
    //insert new user
    async insertUser(user: UserDTO): Promise<boolean | undefined>{
        const result: [User] | undefined = await this.userRepository.saveUser(user);     
        return !!result;
    }
    
    //update nickname by username
    async updateUser(user: UserDTO): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.updateNicknameByUsername(user.username, user.nickname);
        return result;
    }
    
    //delete user by username
    async deleteUser(user: UserDTO): Promise<User | undefined>{
        const result: User | undefined = await this.userRepository.deleteUser(user.username);
        return result;
    }
}