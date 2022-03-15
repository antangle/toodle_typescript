import { Auth } from './auth.entity';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    username!: string;

    @Column()
    email?: string;

    @Column()
    password!: string;

    @Column()
    nickname!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column({
        nullable: true
    })
    start_of_day?: string;

    @Column({
        nullable: true
    })
    end_of_day?: string;

    @Column({
        nullable: true
    })
    terms_and_agreement?: number;

    @Column({
        nullable: true
    })
    login_method?: number

    @OneToMany(() => Auth, auth => auth.user)
    auth?: Auth[]
}