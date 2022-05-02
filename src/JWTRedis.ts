import * as jsonwebtoken from 'jsonwebtoken';
import {Secret, VerifyErrors} from "jsonwebtoken";
import {SignOptions} from "jsonwebtoken";
import Redis from "./Redis";
import {GetPublicKeyOrSecret} from "jsonwebtoken";
import {VerifyOptions} from "jsonwebtoken";
import {DecodeOptions} from "jsonwebtoken";
import TokenInvalidError from "./error/TokenInvalidError";
import TokenDestroyedError from "./error/TokenDestroyedError";
import {RedisClientType} from "redis";


export interface Options {
    prefix: string;
}

export default class JWTRedis {

    private readonly options: Options;
    private readonly redis: Redis;

    constructor(private readonly redisClient: RedisClientType, options?: Options) {
        this.options = Object.assign({prefix: 'jwt_label:'}, options || {});
        this.redis = new Redis(redisClient);
    }

    public sign = async <T extends object & { jti?: string }> (payload: T, secretOrPrivateKey: Secret, options?: SignOptions): Promise<string> => {
        const jti = payload.jti || generateId(10);
        const token: string = jsonwebtoken.sign({...payload, jti}, secretOrPrivateKey, options);
        const decoded: any = jsonwebtoken.decode(token);
        const key = this.options.prefix + jti;
        if (decoded.exp) {
            const now = Date.now();
            const duration = Math.floor(decoded.exp - (now / 1000));
            if(duration > 0){
                await this.redis.setExp(key, 'true',  duration);
            }
        } else{
            await this.redis.set(key, 'true');
        }
        return token;
    }

    public destroy = (jti: string): Promise<boolean> => {
        const key = this.options.prefix + jti;
        return this.redis.del(key);
    }

    public decode<T>(token: string, options?: DecodeOptions): T {
        return jsonwebtoken.decode(token, options) as T;
    }

    public verify<T extends object & { jti?: string }>(token: string, secretOrPublicKey: string | Buffer | GetPublicKeyOrSecret, options?: VerifyOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            return jsonwebtoken.verify(token, secretOrPublicKey, options, (err: VerifyErrors, decoded: T) => {
                if (err) {
                    return reject(err);
                }
                return resolve(decoded);
            })
        }).then((decoded: T) => {
            if (!decoded.jti) {
                throw new TokenInvalidError();
            }
            const key = this.options.prefix + decoded.jti;
            return this.redis.get(key)
                .then((result: string) => {
                    if (!result) {
                        throw new TokenDestroyedError();
                    }
                    return decoded;
                });
        })
    }


}

function generateId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
