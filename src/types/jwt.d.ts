declare module jsonwebtoken {
    export interface JwtPayload extends JwtPayload{
        username: string;
        role: string;
    }
}