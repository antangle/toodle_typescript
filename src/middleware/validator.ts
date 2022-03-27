import { errCatcher, errCode } from './errorHandler';
import { InputError } from '../error/inputError';
import { UserDTO } from '../dto/userDTO';
import consts from '../const/consts';
import { NextFunction, Request, Response } from "express";

const validateInputUnwrap = (req: Request, res: Response, next: NextFunction) => {
    const dto = new UserDTO();
    const inputs = req.body.user;

    //validate email, nickname, password by regex
    const keys = Object.keys(inputs);
    keys.forEach((key) => {
        if(!validate(inputs[key], key)) throw new InputError(errCode(req.pos!, consts.REGEX_UNMATCH_CODE), consts.REGEX_UNMATCH_STR + `: ${key}`);
        dto[key] = inputs[key];
    })
    req.newUser = dto;
    next();
}

const validate = (s: string | undefined, key: string) => {
    if(s == undefined) return false;
    if(key == consts.EMAIL)
        //has the form of email
        return s.match(consts.EMAIL_REGEX);
    else if(key == consts.USERNAME)
        //starts with alphabet, only has alphabet, digits, and unerscore, length of 7~29
        return s.match(consts.USERNAME_REGEX);
    else if(key == consts.NICKNAME)
        //starts with alphabet, only has alphabet, digits, and unerscore, length of 7~29
        return s.match(consts.NICKNAME_REGEX);
    else if(key == consts.PASSWORD)
        //length of 8~30, at least 1 letter, 1 number, 1 character
        return s.match(consts.PASSWORD_REGEX)
    else if(key == consts.ROLE){
        if(s == consts.ADMIN || s == consts.USER) return true;
        else return false;
    }
    else return true
};

//wrap middleware with errCatcher
export const validateInput = errCatcher(validateInputUnwrap);
