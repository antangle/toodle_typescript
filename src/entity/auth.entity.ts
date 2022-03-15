import { User } from './user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm/index';
import { Entity } from "typeorm";

@Entity('auth')
export class Auth{

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    oauth_provider?: string;

    @Column({
        type: 'varchar',
        length: 2049
    })
    access_token?: string;

    @ManyToOne(() => User, (user: { auth: Auth[]; }) => user.auth)
    user?: User;
}