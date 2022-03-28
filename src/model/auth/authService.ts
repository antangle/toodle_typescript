import { UserDTO } from './../../dto/userDto';
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
    async saveKakaoRefreshToken(user: UserDTO): Promise<boolean>{
        const auth = user.auth![0];
        const {id} = await this.userRepository.findOneOrFail({email: user.email});
        console.log(id);
        console.log(auth);
        const result = await this.authRepository.update({userId: id}, {refresh_token: auth.refresh_token});
        console.log(result);
        return !!result;
    }
}