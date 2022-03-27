export = Object.freeze({
    TYPEORM_CONNECTION_NAME: "toodle1",    
    
    //consts
    EMAIL: "email",
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    USERNAME: "username",
    USERNAME_REGEX: /^[A-Za-z][A-Za-z0-9_]{7,29}$/,
    NICKNAME: "nickname",
    NICKNAME_REGEX: /^[A-Za-z][A-Za-z0-9_]{7,29}$/,
    PASSWORD: "password",
    PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
    ROLE: "role",
    ADMIN: "admin",
    USER: "user",
    
    //POSITION
    
    //jwt
    JWT_ALGORITHM: 'HS256',
    REFRESH_TOKEN_EXP_TIME: "14d",
    ACCESS_TOKEN_EXP_TIME: "1h",
    ACCESSTOKEN: "accessToken",
    REFRESHTOKEN: "refreshToken",
    //oauth

    //kakao
    KAKAO_LOGIN_ERROR: 30,
    KAKAO_STATE_ERROR_CODE: 31,
    KAKAO_NO_ACCESS_CODE_STR: "no oauth access code",
    KAKAO_STATE_ERROR_STR: "invalid state",
    KAKAO_CALLBACK_URI: "http://localhost:3000/oauth/kakao/callback",
    KAKAO_GET_ACCESS_TOKEN_URI: "https://kauth.kakao.com/oauth/token",
    KAKAO_GRANT_TYPE: "authorization_code",

    TEST_URI: "http://localhost:3000/test",

    //Message
    NO_USER_EXISTS_STR: "user does not exist",
    NO_TOKEN_STR: "no token",
    WRONG_INPUT_STR: "wrong user input",
    REFRESH_TOKEN_REQUEST_STR: "give me refresh token!",
    INVALID_TOKEN_STR: "invalid token",
    UNDEFINED_STR: "this const is undefined",
    INSERT_ERROR_STR: "insert not working",
    REGEX_UNMATCH_STR: "regex doesn't match",

    //code
    NO_USER_EXISTS_CODE: 1,
    NO_TOKEN_CODE: 2,
    WRONG_INPUT_CODE: 3,
    INVALID_TOKEN_CODE: 4,
    UNDEFINED_CODE: 5,
    INSERT_ERROR_CODE: 6,
    REGEX_UNMATCH_CODE: 7,
    REFRESH_TOKEN_REQUEST: 77,
});