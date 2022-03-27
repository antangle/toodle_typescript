import { JwtPayload } from 'jsonwebtoken';
import { Router } from "express";

export interface ICustomRouter {
    url: string;
    router: Router;
    routes(): void;
}

export interface IController {
    url: string;
    router: Router;
}

export interface JwtResult {
    isvalid: boolean;
    payload?: JwtPayload;
    refresh?: boolean;
}

export interface ExpressSettings{
    key: string;
    value: string;
}

export interface Result{
	status?: number,
	data?: any,
    msg?: string,
}