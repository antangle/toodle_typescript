import axios, { AxiosRequestHeaders, Method } from "axios";
import consts from "../const/consts";

export function objectToQueryString(params: {[key: string]: string}){
    return Object.keys(params)
    .map(key => encodeURIComponent(key)+"="+encodeURI(params[key]))
    .join("&")
}

export function getBodyQS(code: string, redirectURI: string):string {
    const bodyParams: { [key: string]: string; } = {
        grant_type: consts.KAKAO_GRANT_TYPE,
        client_id: process.env.KAKAO_API_KEY!,
        redirect_uri: redirectURI,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        code: code
    };
    const queryStringBody = objectToQueryString(bodyParams);
    return queryStringBody ;
}

export async function call(method: Method, url: string | undefined, header?: AxiosRequestHeaders, data?: any) {
    return await axios({
        method: method,
        url: url,
        headers: header,
        data: data
    });
}