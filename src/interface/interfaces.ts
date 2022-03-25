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

export interface jwtResult {
    isvalid: boolean;
    data?: any;
}

export interface Result{
	status?: number,
	data?: any,
    msg?: string,
}