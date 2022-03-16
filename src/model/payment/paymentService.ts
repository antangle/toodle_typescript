import { ProductRepository } from './productRepository';
import express, { Request, Response, NextFunction} from 'express';
import { Connection, getConnection, getCustomRepository, Repository } from "typeorm";
import { Product } from '../../entity/product.entity';

export class PaymentService{
    //repository
    productRepository: ProductRepository    
    constructor(connectionName:string){
        //get new connection
        this.productRepository = getConnection(connectionName).getCustomRepository(ProductRepository);
    }
    
}