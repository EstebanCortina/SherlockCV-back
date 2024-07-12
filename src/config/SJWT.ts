import * as jose from 'jose'
import {JWTPayload} from "jose";

export default class SJWT {
    private static _secret: string;

    constructor(secretWord: string) {
        console.log(secretWord)
        SJWT._secret = this._getSecret(secretWord)
    }

    static async getJWT(payload: any, expirationTime: string): Promise<any> {
        const secret = jose.base64url.decode(SJWT._secret)
        return await new jose.EncryptJWT(payload)
            .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
            .setIssuedAt()
            .setIssuer('SherlockCV')
            .setAudience('SherlockCV-Front')
            .setExpirationTime(expirationTime)
            .encrypt(secret)
    }

    static async decrypt(jwt: string): Promise<JWTPayload> {
        const secret = jose.base64url.decode(SJWT._secret)
        const {payload} = await jose.jwtDecrypt(jwt, secret, {
            issuer: "SherlockCV",
            audience: "SherlockCV-Front"
        })
        return payload
    }

    private _getSecret(secretWord: string) {
        if(SJWT._secret){
            return SJWT._secret;
        }
        return (
            jose.base64url.encode(
                new TextEncoder().encode(secretWord)
            )
        )
    }
}