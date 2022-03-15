import { User } from "../entity/user.entity";

interface Result{
    status?: number,
	data?: any,
    message?: string,
    code?: number
}

declare global {
	namespace Express {
		interface Request {
			result?: Result;
		}
	}
}