import { Column, PrimaryGeneratedColumn } from 'typeorm/index';
import { Entity } from "typeorm";

@Entity('product')
export class Product{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @Column({
        type: 'varchar',
        length: 2049
    })
    cost?: number;
}