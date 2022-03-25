import { Product } from './../../entity/product.entity';
import { Request, Response, NextFunction } from 'express';
import { ProductService } from './productService';
import consts from '../../const/constants'

export const getProductInfo = async (req: Request, res: Response, next: NextFunction) => {
    const productService = new ProductService(consts.TYPEORM_CONNECTION_NAME);
    
    //parse paymentInfo
    const productName: string = req.body.product;

    productService.getProductInfo(productName);
}