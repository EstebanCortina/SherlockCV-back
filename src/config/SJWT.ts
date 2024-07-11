import * as jose from 'jose'

export default class SJWT {
    private static _secret: string;

    constructor(secretWord: string) {
        console.log(secretWord)
        let a = this._getSecret(secretWord)
        console.log(a)
        SJWT._secret = a
    }

    static async getJWT(payload: any): Promise<any> {
        const secret = jose.base64url.decode(SJWT._secret)
        return await new jose.EncryptJWT(payload)
            .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
            .setIssuedAt()
            .setIssuer('SherlockCV')
            .setAudience('SherlockCV-Front')
            .setExpirationTime('2h')
            .encrypt(secret)
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