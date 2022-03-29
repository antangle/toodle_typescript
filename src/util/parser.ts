import { isNumber } from "util";

export function parseMerchantId(merchant_id: string): number{
    const productIdStr = merchant_id.split("_")[1];
    const productId = parseInt(productIdStr);
    if(!isNumber(productId)) return -1;
    return productId;
}