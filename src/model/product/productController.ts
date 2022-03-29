import { CustomError } from './../../error/customError';
import { makeApiResponse } from './../../util/responseHandler';
import { setpos } from './../../middleware/setPosition';
import { errCatcher, errCode } from './../../middleware/errorHandler';
import { PaymentService } from './../payment/paymentService';
import { Product } from './../../entity/product.entity';
import { Request, Response, NextFunction, Router } from 'express';
import { ProductService } from './productService';
import consts from '../../const/consts'
import { IController } from '../../interface/interfaces';
import { verify } from '../../middleware/jwt';

export class ProductController implements IController{
    public url: string;
    public router: Router;
    public productService: ProductService;
    constructor(url: string, productService: ProductService){
        this.url = url;
        this.router = Router();
        this.productService = productService;
        this.routes();
    }
    public routes(){
        this.router.post('/', setpos(401), errCatcher(this.saveProduct.bind(this)));
    }

    //301
    private async saveProduct(req: Request, res: Response, next: NextFunction){
        const product: Product = new Product();
        product.cost = 100;
        product.product_name = "testproduct";
        const saved = await this.productService.save(product);
        if(!saved) throw new CustomError(errCode(req.pos!, consts.PRODUCT_NOT_EXIST_CODE), consts.PRODUCT_NOT_EXIST_STR);

        req.result = makeApiResponse(req.pos!);
        res.send(req.result);
    }
}