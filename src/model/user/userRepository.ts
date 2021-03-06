import { UserDto } from './../../dto/userDto';
import {DeleteResult, EntityRepository, FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";
import {User} from "../../entity/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findAll(): Promise<User[] | undefined> {
        return this.createQueryBuilder("user")
            .getMany();
    }
    
    async findByNames(username: string, nickname: string): Promise<User[] | undefined> {
        const result = await this.createQueryBuilder("user")
            .where("user.name = :name", { username })
            .andWhere("user.nickname = :nickname", { nickname })
            .getMany();
        return result;
    }
    //for checking if username exists
    async findUsername(username: string): Promise<User | undefined>{
        return await this.findOne({username: username});
    }

    async findPasswordByEmail(email: string): Promise<User | undefined>{
        const result = await this.createQueryBuilder("user")
            .select("user.password")
            .where("user.email = :email", {email})
            .getOne();
        return result;
    }
    async saveUser(user: UserDto): Promise<any>{
        const result = await this.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                username: user.username,
                nickname: user.nickname,
                password: user.password,
                email: user.email,
                terms_and_agreement: user.terms_and_agreement,
                role: user.role,
                refreshToken: user.refreshToken,
            })
            .returning("*")
            .execute();
        return result.raw;
    }

    async updateRefreshToken(email: string, token: string): Promise<boolean>{
        const result = await this.createQueryBuilder()
            .update(User)
            .set({
                refreshToken: token
            } as any) // wtf??
            .where({
                email: email
            })
        return !!result;
    }
    
    async updateNicknameByUsername(username: string, nickname: string | undefined): Promise<any> {
        const result = await this.createQueryBuilder()
            .update(User)
            .set({
                nickname: nickname
            })
            .where({
                username: username, 
            })
            .returning("nickname")
            .execute();
        return result.raw;
    }

    async deleteUser(username: string): Promise<any>{
        const result = await this.createQueryBuilder()
            .delete()
            .from(User)
            .where("username = :username", {username: username})
            .returning("username")
            .execute();
        return result.raw;
    }
}