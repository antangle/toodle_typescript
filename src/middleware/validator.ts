import { InputError } from '../error/inputError';
import { CustomError } from '../error/customError';
import { UserDTO } from '../dto/userDTO';
import { User } from '../entity/user.entity';
import { NextFunction, Request, Response } from "express";

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
    const dto = new UserDTO();
    const inputs = req.body.user;

    //validate email, nickname, password by regex
    const keys = Object.keys(inputs);
    keys.forEach((key) => {
        if(!validate(inputs[key], key)) throw new InputError(2, `wrong ${key} regex`);
        dto[key] = inputs[key];
    })
    req.newUser = dto;
    next();
}

const validate = (s: string | undefined, key: string) => {
    if(s == undefined) return false;
    if(key == "email")
        //has the form of email
        return s.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    else if(key == "username")
        //starts with alphabet, only has alphabet, digits, and unerscore, length of 7~29
        return s.match(/^[A-Za-z][A-Za-z0-9_]{7,29}$/);
    else if(key == "nickname")
        //starts with alphabet, only has alphabet, digits, and unerscore, length of 7~29
        return s.match(/^[A-Za-z][A-Za-z0-9_]{7,29}$/);
    else if(key == "password")
        //length of 8~30, at least 1 letter, 1 number, 1 character
        return s.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/)
    else if(key == "role"){
        if(s == "admin" || s == "user") return true;
        else return false;
    }
    else return true
};
