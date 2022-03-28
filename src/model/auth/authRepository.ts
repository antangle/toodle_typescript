import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';
import { Auth } from './../../entity/auth.entity';
@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
    
}