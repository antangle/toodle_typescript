import { PaymentRepository } from './paymentRepository';
import { Payment } from './../../entity/payment.entity';
import { ProductRepository } from '../product/productRepository';
import express, { Request, Response, NextFunction} from 'express';
import { Connection, getConnection, getCustomRepository, Repository } from "typeorm";
import { Product } from '../../entity/product.entity';

export class PaymentService{
    //repository
    paymentRepository: PaymentRepository  
    constructor(connectionName:string){
        //get new connection
        this.paymentRepository = getConnection(connectionName).getCustomRepository(ProductRepository);
    }
    
    async savePayment(payment:Payment): Promise<Payment | undefined>{
        return this.paymentRepository.save(payment);
    }
}