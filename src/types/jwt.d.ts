declare module jsonwebtoken {
    export interface JwtPayload extends JwtPayload{
        email: string;
        userId: number;
        role: string;
    }
}