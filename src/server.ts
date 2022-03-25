import express, { ErrorRequestHandler } from 'express';
import { ICustomRouter, IController } from './interface/interfaces';

export class Server {
    public app: express.Application;
    port = 3000;

    constructor(routers: ICustomRouter[], middlewares: any[], errorHandler: ErrorRequestHandler) {
        this.app = express();
        this.config(routers, middlewares, errorHandler);
    }

    public start(){
        this.app.listen(this.port, () => {
            console.log(`-------server is listening at port ${this.port}---------`);
        });
    }

    //set middlewares and routers, errorHandlers
    private config(middlewares: any[], controllers: IController[], errorHandler: ErrorRequestHandler){
        this.setMiddlewares(middlewares);
        this.setControllers(controllers);

        //errorHandler should be the last
        this.setGlobalErrorHandler(errorHandler);
    }

    private setMiddlewares(middlewares: any[]){
        middlewares.forEach((middleware: any) => {
            this.app.use(middleware);
        });
    }

    private setControllers(controllers: IController[]){
        controllers.forEach((controller: IController) => {
            this.app.use(controller.url, controller.router);
        });
    }

    private setGlobalErrorHandler(globalErrorHandler: ErrorRequestHandler){
        this.app.use(globalErrorHandler);
    }
}