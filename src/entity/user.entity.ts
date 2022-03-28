import { Auth } from './auth.entity';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        nullable: true
    })
    username?: string;

    @Column({
        unique: true
    })
    email?: string;

    @Column({
        length: 73,
        nullable: true
    })
    password?: string;

    @Column({
        nullable: true
    })
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

    @OneToMany(() => Auth, auth => auth.user, {
        cascade: true
    })
    auth?: Auth[];

    @Column({
        default: "user"
    })
    role?: string;

    @Column({
        nullable: true,
    })
    refreshToken?: string;
}