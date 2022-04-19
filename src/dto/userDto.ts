import { User } from '../entity/user.entity';
import { Auth } from '../entity/auth.entity';
export class UserDto {
    
    [key: string]: any;
    id ?: number;
    username !: string;
    nickname ?: string;
    password ?: string;
    email ?: string;
    terms_and_agreement ?: number;
    role ?: string;
    refreshToken ?: string;
    auth ?: Auth[];

    toUserEntity(){
        const user = new User();
        user.nickname = this.nickname;
        user.password = this.password;
        user.email = this.email;
        user.refreshToken = this.refreshToken;
        user.auth = this.auth;
        return user;
    }
}