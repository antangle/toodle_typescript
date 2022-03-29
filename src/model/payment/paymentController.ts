import { makeApiResponse } from './../../util/responseHandler';
import { Product } from './../../entity/product.entity';
import { errCode } from './../../middleware/errorHandler';
import { CustomError } from './../../error/customError';
import { setpos } from './../../middleware/setPosition';
import { IController } from './../../interface/interfaces';
import { Payment } from './../../entity/payment.entity';
import { PaymentService } from './../payment/paymentService';
import { Request, Response, NextFunction, Router} from 'express';
import consts from '../../const/consts'
import { verify } from '../../middleware/jwt';
import { errCatcher } from '../../middleware/errorHandler';
import { call } from '../../util/axiosUtil';
import { ProductService } from '../product/productService';
import { AxiosResponse } from 'axios';
import { parseMerchantId } from '../../util/parser';
import { ESRCH } from 'constants';

export class PaymentController implements IController{
    public url: string;
    public router: Router;
    public paymentService: PaymentService;
    public productService: ProductService;
    constructor(url: string, paymentService: PaymentService, productService: ProductService){
        this.url = url;
        this.router = Router();
        this.paymentService = paymentService;
        this.productService = productService;
        this.routes();
    }
    public routes(){
        this.router.post('/complete', verify, setpos(302), errCatcher(this.onPaymentComplete.bind(this)));
        this.router.get('/paymentPage', verify, setpos(301), errCatcher(this.payment.bind(this)));
    }


    private async payment(req: Request, res: Response, next: NextFunction){
        res.render('payment');
    }

    private async onPaymentComplete(req: Request, res: Response, next: NextFunction){
        //get uids
        //todo: body comes in querystring format

        const {imp_uid, merchant_id} = req.body;

        //get iamport access token
        const getToken = await call(
            consts.POST, 
            consts.IAMPORT_GETTOKEN_URI,
            { 
                "Content-Type": "application/json" 
            },
            {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET
            }
        );

        //get paymentdata via imp_uid and access token
        const paymentData: AxiosResponse = await call(
            consts.GET,
            consts.IAMPORT_PAYMENTS_URI + imp_uid,
            { "Authorization": getToken.data.response.access_token }
        );
        
        //parse merchant_uid
        const productId = parseMerchantId(paymentData.data.response.merchant_uid);
    
        //get real amount from db
        const product: Product | undefined = await this.productService.getProductInfo(productId);
        if(!product) throw new CustomError(errCode(req.pos!, consts.PRODUCT_NOT_EXIST_CODE), consts.PRODUCT_NOT_EXIST_STR);

        //compare payment data
        //if payment data does not match, throw
        if(product.cost != paymentData.data.response.amount) throw new CustomError(errCode(req.pos!, consts.PAYMENT_NOT_MATCH_CODE), consts.PAYMENT_NOT_MATCH_STR);

        //if payment data matches
        //userId from verify middleware
        const userId = req.userId;

        //save payment info in db
        const payment = new Payment()
        payment.cost = product.cost;
        payment.userId = userId;
        payment.merchant_uid = paymentData.data.response.merchant_uid;
        payment.productId = product.id;
        const pay = await this.paymentService.savePayment(payment);
        if(!pay) throw new CustomError(errCode(req.pos!, consts.INSERT_ERROR_CODE), consts.INSERT_ERROR_STR);
        //send response
        req.result = makeApiResponse(req.pos!);
        res.send(req.result);
    }
}