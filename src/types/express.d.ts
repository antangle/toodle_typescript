
declare namespace Express{
	import { Result } from "../interface/interfaces";
	import { User } from './../entity/user.entity';
	interface Request {
		result ?: Result;
		newUser ?: User;
		pos ?: number;
	}
}


