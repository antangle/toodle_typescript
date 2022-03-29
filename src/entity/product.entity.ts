import { Column, PrimaryGeneratedColumn } from 'typeorm/index';
import { Entity } from "typeorm";

@Entity('product')
export class Product{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    product_name?: string;

    @Column()
    cost?: number;
}