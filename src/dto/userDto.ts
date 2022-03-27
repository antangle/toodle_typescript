export class UserDTO {
    [key: string]: any;
    username !: string;
    nickname ?: string;
    password ?: string;
    email ?: string;
    terms_and_agreement ?: number;
    role ?: string;
    refreshToken ?: string;
}