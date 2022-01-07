import { User } from "../entity/User";

interface Result{
    status: number,

    user?: User[],

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