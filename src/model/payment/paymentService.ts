import { PaymentRepository } from './paymentRepository';
import { Payment } from './../../entity/payment.entity';
import { getConnection } from "typeorm";

export class PaymentService{
    //repository
    paymentRepository: PaymentRepository  
    constructor(connectionName:string){
        //get new connection
        this.paymentRepository = getConnection(connectionName).getCustomRepository(PaymentRepository);
    }
    
    async savePayment(payment: Payment): Promise<Payment | undefined>{
        return this.paymentRepository.save(payment);
    }
}