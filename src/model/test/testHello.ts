import express, { Request, Response, NextFunction} from 'express';

export default async function testHello(req:Request, res:Response, next:NextFunction){
    res.send("hello World!");
}