import { User } from './user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm/index';
import { Entity } from "typeorm";

@Entity('auth')
export class Auth{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    provider?: string;
    
    @Column()
    register_id ?: number;

    @Column({
        type: 'varchar',
        length: 2049
    })
    refresh_token?: string;

    @ManyToOne(() => User, user => user.auth)
    user?: User;

    @Column()
    userId?: number;
}