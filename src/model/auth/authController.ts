import { hashPassword } from './../../middleware/passwordEncrypter';
import { sign } from './../../middleware/jwt';
import { InputError } from './../../error/inputError';
import { makeApiResponse } from './../../middleware/responseHandler';
import { validateInput } from '../../middleware/validator';
import { UserDTO } from './../../dto/userDto';
import { UserService } from './../user/userService';
import { errCatcher } from './../../middleware/errorHandler';
import { Router } from 'express';
import { CustomError } from '../../error/customError';
import { IController } from '../../interface/interfaces';
import { Request, Response, NextFunction} from 'express';
import { comparePassword } from '../../middleware/passwordEncrypter';
import cookie from 'cookie';
export class AuthController implements IController{
    public url: string;
    public router: Router;
    public service: UserService;
    constructor(url: string, userService: UserService){
        this.url = url;
        this.router = Router();
        this.service = userService;
        this.routes();
    }
    private routes(){
        this.router.post('/check', validateInput, errCatcher(this.checkUsernameExists.bind(this)));        
        this.router.post('/login', validateInput, errCatcher(this.login.bind(this)));
        this.router.post('/signin', validateInput, errCatcher(this.signIn.bind(this)));
    }

    private async checkUsernameExists(req: Request, res: Response, next: NextFunction){
        const newUser: UserDTO = req.newUser;
        if(!newUser) throw new CustomError(2011, 'user input is wrong');
        
        const isUsernameExists: boolean = await this.service.getUsername(newUser);
        
        req.result = makeApiResponse(201, isUsernameExists);
        res.send(req.result);
    }
    
    //local login. only with username, password, when succeed => sign new access token
    private async login(req:Request, res:Response, next:NextFunction){
        const user: UserDTO = req.newUser;
        if(!user) throw new InputError(2021, 'user input is wrong');
        
        //get hashed password from db
        const hashedPassword: string | undefined = await this.service.getPasswordByUsername(user);
        if(!hashedPassword) throw new CustomError(-2021, 'no such user exists');
        
        //compare password with bcrypt
        const isPasswordMatch = await comparePassword(user.password!, hashedPassword);
        if(!isPasswordMatch) throw new CustomError(2021, 'wrong password or invalid username');

        //sign jwt and send
        const token = sign(user).accessToken;
        
        req.result = makeApiResponse(202);
        res.cookie('token', token, {path: '/', httpOnly: true});
        res.send(req.result);
    }
    
    private async signIn(req:Request, res:Response, next:NextFunction){
        const user: UserDTO = req.newUser;
        if(!user) throw new InputError(2031, 'user input is wrong');
        
        //hash password with bcrypt
        user.password = await hashPassword(user.password!);        
        
        //sign jwt and send
        const token = sign(user).accessToken;
        
        await this.service.insertUser(user);
        
        req.result = makeApiResponse(203);
        res.cookie('token', token, {path: '/', httpOnly: true});
        //res.setHeader('Set-Cookie', cookie.serialize('token', token, {httpOnly: true}))
        res.send(req.result);
    }
}