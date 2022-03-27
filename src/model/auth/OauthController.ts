import { Response, NextFunction } from 'express';
import { setpos } from './../../middleware/setPosition';
import { UserService } from './../user/userService';
import { Router, Request } from 'express';
import { IController } from "../../interface/interfaces";
import { errCatcher, errCode } from '../../middleware/errorHandler';
import { CustomError } from '../../error/customError';
import consts from '../../const/consts';
import axios from 'axios';
import { stringify } from 'querystring';
export class KakaoController implements IController{
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
        this.router.get('/login', setpos(220), errCatcher(this.login.bind(this)));
        this.router.get('/callback', setpos(221), errCatcher(this.redirectCallback.bind(this)));
        this.router.post('/callback', setpos(222), errCatcher(this.redirectCallback.bind(this)));
    }
    
    private login(req:Request, res:Response, next:NextFunction){
        const renderPayload = {
            client_id: process.env.KAKAO_API_KEY,
            redirect_uri: consts.KAKAO_CALLBACK_URI,
            state: process.env.KAKAO_STATE,
        };
        //render ejs template, gives kakao login href
        res.render('index', renderPayload);
    }
    private signin(req:Request, res:Response, next:NextFunction){

    }
    //when kakao login is completed, get callback with authorization code
    async redirectCallback(req:Request, res:Response, next:NextFunction){

        if(req.query.error) throw new CustomError(errCode(req.pos!, consts.KAKAO_LOGIN_ERROR), req.query.error as string);
        if(req.query.state != process.env.KAKAO_STATE) throw new CustomError(errCode(req.pos!, consts.KAKAO_STATE_ERROR_CODE), consts.KAKAO_STATE_ERROR_STR);
        
        const bodyParams: {[key: string]: string} = {
            grant_type: consts.KAKAO_GRANT_TYPE,
            client_id: process.env.KAKAO_API_KEY!,
            redirect_uri: consts.KAKAO_CALLBACK_URI,                
            client_secret: process.env.KAKAO_CLIENT_SECRET!,
            code: req.query.code as string
        }

        const queryStringBody = this.objectToQueryString(bodyParams);
        const header = { 'content-type':'application/x-www-form-urlencoded' }
        const kakaoApiResponse = await axios({
            method: 'POST',
            url: consts.KAKAO_GET_ACCESS_TOKEN_URI,
            headers: header,
            data: queryStringBody
        });
        console.log(kakaoApiResponse.data);
        const kakaoAccessToken = kakaoApiResponse.data.access_token;
        const kakaoRefreshToken = kakaoApiResponse.data.refresh_token;
        
        //save refreshToken in db

        res.cookie('kakaoAccessToken', kakaoAccessToken, {path: '/', httpOnly: true});
        res.cookie('kakaoRefreshToken', kakaoRefreshToken, {path: '/', httpOnly: true});

        //then send out two tokens via cookies
        res.send('done!');
    }
    
    public objectToQueryString(params: {[key: string]: string}){
        return Object.keys(params)
        .map(key => encodeURIComponent(key)+"="+encodeURI(params[key]))
        .join("&")
    }
}