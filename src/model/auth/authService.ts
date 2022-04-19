import { User } from './../../entity/user.entity';
import { UserDto } from './../../dto/userDto';
import { getConnection } from 'typeorm';
import { AuthRepository } from './authRepository';
import { UserRepository } from './../user/userRepository';
export class AuthService{
    //repository
    authRepository : AuthRepository;
    userRepository : UserRepository;
    
    constructor(connectionName: string){
        //get new connection
        this.authRepository = getConnection(connectionName).getCustomRepository(AuthRepository);
        this.userRepository = getConnection(connectionName).getCustomRepository(UserRepository);
    }
    async saveKakaoRefreshToken(user: UserDto): Promise<User | undefined>{
        const auth = user.auth![0];
        const userdb = await this.userRepository.findOneOrFail({email: user.email});
        const result = await this.authRepository.update({userId: userdb.id}, {refresh_token: auth.refresh_token});
        return userdb;
    }
}