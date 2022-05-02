import {RedisClientType} from "redis";


export default class Redis {

    constructor(private readonly redisClient: RedisClientType) {
    }


    public set(key: string, value: string): Promise<string | null> {
        return this.redisClient.set(key, value);
    }

    public setExp(key: string, value: string, duration: number): Promise<string | null> {
        return this.redisClient.set(key, value, {EX: duration});
    }

    public del(key: string): Promise<boolean>{
        return this.redisClient.del(key)
            .then((res)=>{
                return !!res;
            });
    }

    public get(key: string): Promise<string | null>{
        return this.redisClient.get(key);
    }
}
