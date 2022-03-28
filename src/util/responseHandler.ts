import { Result } from "../interface/interfaces";

export const makeApiResponse = (statusCode: number, data?: any, msg?: string): Result => {
    return {
        status: statusCode,
        data: data,
        msg: msg
    }
}
