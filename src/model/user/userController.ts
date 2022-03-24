import { errCatcher } from './../../middleware/errorHandler';
import { validateUser } from './../../middleware/inputParser';
import { TYPEORM_CONNECTION_NAME } from './../../const/constants';
import { UserDTO } from './../../dto/userDTO';
import { IController } from './../../interface/interfaces';
import { Request, Response, NextFunction, Router } from 'express';
import { UserService } from './userService';
import { User } from '../../entity/user.entity';
import { CustomError } from '../../error/customError';
import { makeApiResponse } from '../../middleware/responseHandler';
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

    public routes(){
        this.router.get('/',                errCatcher(this.getUser.bind(this)));
        this.router.post('/', validateUser, errCatcher(this.insertUser.bind(this)));
        this.router.patch('/', validateUser, errCatcher(this.updateUserNickname.bind(this)));
        this.router.delete('/', validateUser, errCatcher(this.deleteUser.bind(this)));
        this.router.post('/login', errCatcher(this.localLogin.bind(this)));
    }

    public async getUser(req: Request, res: Response, next: NextFunction){
        const user: User[] | undefined = await this.service.getAllUser();
        if(!user) throw new CustomError(-1011, 'user does not exist');

        req.result = makeApiResponse(101, user);
        res.send(req.result);
    }

    
    public async insertUser(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDTO = req.newUser;
        if(!newUser) throw new CustomError(1021, 'user input is wrong');
        
        //insert
        const user: User | undefined = await this.service.insertUser(newUser);
        if(!user) throw new CustomError(-1021, 'user does not exist');
        
        //send response
        req.result = makeApiResponse(102, user);
        res.send(req.result);
    }
    
    public async updateUserNickname(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDTO = req.newUser;
        if(!newUser) throw new CustomError(1031, 'user input is wrong');
        
        //update
        const user: User | undefined = await this.service.updateUser(newUser);
        if(!user) throw new CustomError(-1031, 'user does not exist');
        
        //send response
        req.result = makeApiResponse(103, user);
        res.send(req.result);
    }
    
    public async deleteUser(req: Request, res: Response, next: NextFunction){
        //parsing middleware put newUser in req object
        const newUser: UserDTO = req.newUser;
        if(!newUser) throw new CustomError(1041, 'user input is wrong');
        
        //delete user
        const user: User | undefined = await this.service.deleteUser(newUser);
        if(!user) throw new CustomError(-1041, 'user does not exist');
        
        //send response
        req.result = makeApiResponse(104, user);
        res.send(req.result);
    }
    
    public async localLogin(req: Request, res: Response, next: NextFunction){
        
        //send response
    }
}