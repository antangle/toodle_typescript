export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errorMsg: string;

    constructor(statusCode: number, errorMsg: string){
        super();
        this.statusCode = statusCode;
        this.errorMsg = errorMsg;
    }
}