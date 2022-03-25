import { CustomError } from './customError';
export class InputError extends CustomError{
    constructor(statusCode: number, errorMsg: string, data?: any){
        super(statusCode, errorMsg);
    }
}