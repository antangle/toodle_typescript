import { Payment } from './../../entity/payment.entity';
import { PaymentService } from './../payment/paymentService';
import express, { Request, Response, NextFunction} from 'express';
import consts from '../../const/consts'

export const savePaymentInfo = async (req: Request, res: Response, next: NextFunction) => {
    const paymentService = new PaymentService(consts.TYPEORM_CONNECTION_NAME);
    
    //parse paymentInfo
    const paymentInfo: Payment = req.body.payment

    paymentService.savePayment(paymentInfo)
}