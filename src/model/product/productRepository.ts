import { Product } from '../../entity/product.entity';
import {EntityRepository, FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async getProduct(productName: string): Promise<Product | undefined>{
        return this.createQueryBuilder("product")
            .where("product.name = :name", {productName})
            .getOne();
    }
}