import { Auth } from './../../entity/auth.entity';
import { setpos } from './../../middleware/setPosition';
import { User } from './../../entity/user.entity';
import { hashPassword } from '../../util/passwordEncrypter';
import { sign } from './../../middleware/jwt';
import { InputError } from './../../error/inputError';
import { makeApiResponse } from '../../util/responseHandler';
import { validateInput } from '../../middleware/validator';
import { UserDTO } from './../../dto/userDto';
import { UserService } from './../user/userService';
import { errCatcher, errCode } from './../../middleware/errorHandler';
import { Router } from 'express';
import { CustomError } from '../../error/customError';
import { IController } from '../../interface/interfaces';
import { Request, Response, NextFunction} from 'express';
import { comparePassword } from '../../util/passwordEncrypter';
import consts from '../../const/consts';

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
        this.router.post('/check', setpos(201), validateInput, errCatcher(this.checkEmailExists.bind(this)));
        this.router.post('/login', setpos(202), validateInput, errCatcher(this.login.bind(this)));
        this.router.post('/signin', setpos(203), validateInput, errCatcher(this.signIn.bind(this)));
    }
    //for sign in -> check id function
    
    //201
    private async checkEmailExists(req: Request, res: Response, next: NextFunction){
        const newUser: UserDTO = req.newUser;
        if(!newUser) throw new CustomError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);
        
        const isEmailExists: boolean = await this.service.getEmail(newUser);
        
        req.result = makeApiResponse(req.pos!, isEmailExists);
        res.send(req.result);
    }
    //202
    //local login. only with username, password, when succeed => sign new access token
    private async login(req:Request, res:Response, next:NextFunction){
        const user: UserDTO = req.newUser;
        if(!user) throw new InputError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);

        //get hashed password from db
        const password: string | undefined = await this.service.getPasswordByEmail(user);
        if(!password) throw new CustomError(errCode(req.pos!, consts.NO_USER_EXISTS_CODE), consts.NO_USER_EXISTS_STR);
        const hashPassword = password;

        //compare password with bcrypt
        const isPasswordMatch = await comparePassword(user.password!, hashPassword!);
        if(!isPasswordMatch) throw new CustomError(errCode(req.pos!, consts.NO_USER_EXISTS_CODE), consts.NO_USER_EXISTS_STR);

        //sign jwt and send
        const token = sign(user);

        req.result = makeApiResponse(req.pos!);
        res.cookie('accessToken', token.accessToken, {path: '/', httpOnly: true});
        res.cookie('refreshToken', token.refreshToken, {path: '/', httpOnly: true});
        res.send(req.result);
    }

    //203
    //signing in logic. when successful, insert db then sign tokens
    private async signIn(req:Request, res:Response, next:NextFunction){
        const user: UserDTO = req.newUser;
        if(!user) throw new InputError(errCode(req.pos!, consts.WRONG_INPUT_CODE), consts.WRONG_INPUT_STR);
        
        //hash password with bcrypt
        user.password = await hashPassword(user.password!);        
        
        //sign jwt and send
        const token = sign(user);

        user.refreshToken = token.refreshToken;
        const result = await this.service.insertUser(user);
        if(!result) throw new CustomError(errCode(req.pos!, consts.INSERT_ERROR_CODE), consts.INSERT_ERROR_STR);

        req.result = makeApiResponse(req.pos!);
        res.cookie('accessToken', token.accessToken, {path: '/', httpOnly: true});
        res.cookie('refreshToken', token.refreshToken, {path: '/', httpOnly: true});
        res.send(req.result);
    }
}