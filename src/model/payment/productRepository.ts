import { Product } from '../../entity/product.entity';
import {EntityRepository, FindConditions, FindManyOptions, Repository, UpdateResult} from "typeorm";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    
}