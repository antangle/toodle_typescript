import {EntityRepository, FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";
import {User} from "../entity/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findAll(): Promise<User[] | undefined>{
        return this.createQueryBuilder("user")
            .getMany();
    }
    
    findByNames(username: string, nickname: string): Promise<User[] | undefined>{
        return this.createQueryBuilder("user")
            .where("user.name = :name", { username })
            .andWhere("user.nickname = :nickname", { nickname })
            .getMany();
    }

    async updateNicknameByUsername(username: string, nickname: string): Promise<any>{
        const result:UpdateResult = await this.createQueryBuilder()
            .update(User)
            .set({nickname: nickname})
            .where({
                username: username, 
            })
            .execute();
        return result
    }

    async deleteUser(username: string): Promise<any>{
        return this.createQueryBuilder()
            .delete()
            .from(User)
            .where("username = :username", {username: username})
            .returning("username")
            .execute();
    }
    
}