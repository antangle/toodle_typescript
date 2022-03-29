import { Payment } from './../../entity/payment.entity';
import {EntityRepository, FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {

}