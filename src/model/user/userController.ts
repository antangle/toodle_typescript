import { setpos } from './../../middleware/setPosition';
import { InputError } from './../../error/inputError';
import { hashPassword } from '../../util/passwordEncrypter';
import { errCatcher, errCode } from './../../middleware/errorHandler';
import { validateInput } from '../../middleware/validator';
import { UserDto } from './../../dto/userDto';
import { Request, Response, NextFunction, Router } from 'express';
import { UserService } from './userService';
import { User } from '../../entity/user.entity';
import { CustomError } from '../../error/customError';
import { makeApiResponse } from '../../util/responseHandler';
import { verify } from '../../middleware/jwt';
import consts from '../../const/consts';
import { Auth } from '../../entity/auth.entity';
//simple CRUD

export class UserController{
    private service: UserService;
    public url: string;
    public router: Router

    constructor(url: string, service: UserService){
        this.url = url;
        this.router = Router();
        this.service = service;
        this.routes();
    }

    private routes(){
        this.router.get('/', setpos(101), verify, errCatcher(this.getUser.bind(this)));
        this.router.post('/', setpos(102), validateInput, errCatcher(this.insertUser.bind(this)));
        this.router.patch('/', setpos(103), verify, validateInput, errCatcher(this.updateUserNickname.bind(this)));
        this.router.delete('/', setpos(104), verify, validateInput, errCatcher(this.deleteUser.bind(this)));
    }
    //101
    private async getUser(req: Request, res: Response, next: NextFunction){
        const user: User[] | undefined = await this.service.getAllUser();
        if(!user) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);

        req.result = makeApiResponse(req.pos!, user);
        res.send(req.result);
    }
    //102    
    private async insertUser(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDto = req.newUser;
        if(!newUser) throw new CustomError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);
        
        //hash password with bcrypt
        if(newUser.password == undefined) throw new InputError(errCode(req.pos!, consts.UNDEFINED_CODE), consts.UNDEFINED_STR);
        const hashedPassword = await hashPassword(newUser.password);
        newUser.password = hashedPassword;

        //insert
        const user: User | undefined = await this.service.insertUser(newUser);
        if(!user) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);
        
        //send response
        req.result = makeApiResponse(req.pos!, user);
        res.send(req.result);
    }
    //103
    private async updateUserNickname(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDto = req.newUser;
        if(!newUser) throw new CustomError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);
        
        //update
        const user: User | undefined = await this.service.updateUser(newUser);
        if(!user) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);
        
        //send response
        req.result = makeApiResponse(req.pos!, user);
        res.send(req.result);
    }
    //104    
    private async deleteUser(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDto = req.newUser;
        if(!newUser) throw new CustomError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);
        
        //delete user
        const user: User | undefined = await this.service.deleteUser(newUser);
        if(!user) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);
        
        //send response
        req.result = makeApiResponse(req.pos!, user);
        res.send(req.result);
    }
}