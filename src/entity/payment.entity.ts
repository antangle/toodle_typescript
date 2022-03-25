import { Product } from './product.entity';
import { User } from './user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm/index';
import { Entity } from "typeorm";

@Entity('payment')
export class Payment{

    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => User)
    user?: User

    @ManyToOne(() => Product)
    product?: Product
}