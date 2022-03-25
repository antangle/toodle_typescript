import { Auth } from './auth.entity';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        unique: true
    })
    username!: string;

    @Column({
        unique: true
    })
    email?: string;

    @Column({
        length: 73
    })
    password?: string;

    @Column()
    nickname?: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

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
    login_method?: number;

    @OneToMany(() => Auth, auth => auth.user)
    auth?: Auth[];

    @Column()
    role!: string;

}