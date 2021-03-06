import { AuthService } from './authService';
import { UserDto } from './../../dto/userDto';
import { Response, NextFunction } from 'express';
import { setpos } from '../../middleware/setPosition';
import { UserService } from '../user/userService';
import { Router, Request } from 'express';
import { IController } from "../../interface/interfaces";
import { errCatcher, errCode } from '../../middleware/errorHandler';
import { CustomError } from '../../error/customError';
import consts from '../../const/consts';
import { call, getBodyQS } from '../../util/axiosUtil';
import { Auth } from '../../entity/auth.entity';
import { User } from '../../entity/user.entity';
import { sign } from '../../middleware/jwt';
import { makeApiResponse } from '../../util/responseHandler';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export class KakaoController implements IController{
    public url: string;
    public router: Router;
    public userService: UserService;
    public authService: AuthService;

    constructor(url: string, userService: UserService, authService: AuthService){
        this.url = url;
        this.router = Router();
        this.userService = userService;
        this.authService = authService;
        this.routes();
    }

    private routes(){
        this.router.get('/login', setpos(220), errCatcher(this.login.bind(this)));
        this.router.get('/loginCallback', setpos(221), errCatcher(this.loginCallback.bind(this)));
        this.router.get('/signin', setpos(222), errCatcher(this.signin.bind(this)));
        this.router.get('/signinCallback', setpos(223), errCatcher(this.signinCallback.bind(this)));
        this.router.get('/logout', setpos(224), errCatcher(this.logout.bind(this)));
    }

    
    //signin with kakao oauth2
    private signin(req:Request, res:Response, next:NextFunction){
        const renderPayload = {
            client_id: process.env.KAKAO_API_KEY,
            login_redirect_uri: consts.KAKAO_LOGIN_CALLBACK_URI,
            signin_redirect_uri: consts.KAKAO_SIGNIN_CALLBACK_URI,
            state: process.env.KAKAO_STATE,
        };
        //render ejs template, gives kakao login href
        res.render('kakaoLogin', renderPayload);
    }
    
    private async signinCallback(req:Request, res:Response, next:NextFunction){
        //get authorization code, check errors
        if(req.query.error) throw new CustomError(errCode(req.pos!, consts.KAKAO_LOGIN_ERROR_CODE), req.query.error as string);
        if(req.query.state != process.env.KAKAO_STATE) throw new CustomError(errCode(req.pos!, consts.KAKAO_STATE_ERROR_CODE), consts.KAKAO_STATE_ERROR_STR);

        //get access token
        const kakaoApiResponse = await call(
            consts.POST, 
            consts.KAKAO_GET_ACCESS_TOKEN_URI,
            { 'content-type': 'application/x-www-form-urlencoded' }, 
            getBodyQS(req.query.code as string, consts.KAKAO_SIGNIN_CALLBACK_URI)
        );
        const kakaoAccessToken = kakaoApiResponse.data.access_token;
        const kakaoRefreshToken = kakaoApiResponse.data.refresh_token;

        //get user profile for signin
        const kakaoProfile = await call(
            consts.GET,
            consts.KAKAO_GET_PROFILE_URI,
            {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': 'Bearer ' + kakaoAccessToken
            }
        );

        //insert db 
        const auth = new Auth();
        auth.register_id = kakaoProfile.data.id;
        auth.provider = consts.KAKAO;
        auth.refresh_token = kakaoRefreshToken;
        const user = new UserDto();
        user.email = kakaoProfile.data.kakao_account.email;
        user.nickname = kakaoProfile.data.kakao_account.profile.nickname;
        user.auth = [auth];
        
        //save to db
        const userdb = await this.userService.save(user.toUserEntity())
            .catch((err) => {
                if(err instanceof QueryFailedError){
                    //when user is already signed in
                    if(err.driverError.code == '23505'){
                        res.send("already signed in!!");
                    }
                }
            });
        if(!userdb) throw new CustomError(errCode(req.pos!, consts.INSERT_ERROR_CODE), consts.INSERT_ERROR_STR);

        //when user is already signed in, errhandler catches and sends response.
        //not really sure throwing to errhandler magically is a good idea here..

        //sign new jwts
        user.id = userdb.id;
        const {accessToken, refreshToken} = sign(user);
        
        //send out jwt cookie
        req.result = makeApiResponse(req.pos!);
        res.cookie('accessToken', accessToken, {path: '/', httpOnly: true});
        res.cookie('refreshToken', refreshToken, {path: '/', httpOnly: true});
        
        res.send(req.result);
    }

    private login(req:Request, res:Response, next:NextFunction){
        const renderPayload = {
            client_id: process.env.KAKAO_API_KEY,
            login_redirect_uri: consts.KAKAO_LOGIN_CALLBACK_URI,
            signin_redirect_uri: consts.KAKAO_SIGNIN_CALLBACK_URI,
            state: process.env.KAKAO_STATE,
        };
        //render ejs template, gives kakao login href
        res.render('kakaoLogin', renderPayload);
    }

    //when kakao login is completed, get callback with authorization code
    private async loginCallback(req:Request, res:Response, next:NextFunction){

        if(req.query.error) throw new CustomError(errCode(req.pos!, consts.KAKAO_LOGIN_ERROR_CODE), req.query.error as string);
        if(req.query.state != process.env.KAKAO_STATE) throw new CustomError(errCode(req.pos!, consts.KAKAO_STATE_ERROR_CODE), consts.KAKAO_STATE_ERROR_STR);

        //get access token, method, uri, header, body
        const kakaoApiResponse = await call(
            consts.POST, 
            consts.KAKAO_GET_ACCESS_TOKEN_URI,
            { 'content-type': 'application/x-www-form-urlencoded' }, 
            getBodyQS(req.query.code as string, consts.KAKAO_LOGIN_CALLBACK_URI)
        );
        const kakaoAccessToken = kakaoApiResponse.data.access_token;
        const kakaoRefreshToken = kakaoApiResponse.data.refresh_token;

        //
        const kakaoProfile = await call(
            consts.GET,
            consts.KAKAO_GET_PROFILE_URI,
            {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization': 'Bearer ' + kakaoAccessToken
            }
        );

        const auth = new Auth();
        auth.provider = consts.KAKAO;
        auth.register_id = kakaoProfile.data.id;
        auth.refresh_token = kakaoRefreshToken;

        const userDto = new UserDto();
        userDto.email = kakaoProfile.data.kakao_account.email;
        userDto.nickname = kakaoProfile.data.kakao_account.profile.nickname;
        userDto.auth = [auth];
        //for jwt sign
        userDto.role = "user";
        
        console.log(auth.refresh_token);
        //save refreshToken in db, also checking if user has signed in already
        const userdb: User | undefined | void= await this.authService.saveKakaoRefreshToken(userDto)
            .catch((err) => {
                if(err instanceof EntityNotFoundError){
                    res.send(makeApiResponse(req.pos!, "need to sign in first!"));
                }
            });
        if(!userdb) throw new CustomError(errCode(req.pos!, consts.USER_NOT_EXISTS_CODE), consts.USER_NOT_EXISTS_STR);
        userDto.id = userdb.id;
        const token = sign(userDto);
        //send out local jwts
        req.result = makeApiResponse(req.pos!);
        res.cookie('accessToken', token.accessToken, {path: '/', httpOnly: true});
        res.cookie('refreshToken', token.refreshToken, {path: '/', httpOnly: true});
        res.send(req.result);
        
    }

    //logout is mainly about cutting cookies on frontend.
    private async logout(req:Request, res:Response, next:NextFunction){
        //to be implemented
    }
}
