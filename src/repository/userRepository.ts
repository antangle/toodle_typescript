import {EntityRepository, FindConditions, FindManyOptions, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findAll(): Promise<User[] | undefined>{
        return this.find();
    }
    
    findByNames(name: string, nickname: string): Promise<User[] | undefined>{
        return this.createQueryBuilder("user")
            .where("user.name = :name", { name })
            .andWhere("user.nickname = :nickname", { nickname })
            .getMany();
    }
    
}