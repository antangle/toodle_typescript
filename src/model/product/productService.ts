import { ProductRepository } from './productRepository';
import { Payment } from './../../entity/payment.entity';
import { Connection, getConnection, getCustomRepository, Repository } from "typeorm";
import { Product } from '../../entity/product.entity';

export class ProductService{
    //repository
    productRepository: ProductRepository
    constructor(connectionName:string){
        //get new connection
        this.productRepository = getConnection(connectionName).getCustomRepository(ProductRepository);
    }
    async save(product: Product): Promise<Product | undefined>{
        return this.productRepository.save(product);
    }
    async getProductInfo(productId: number): Promise<Product | undefined>{
        return this.productRepository.findOne({id: productId});
    }
}