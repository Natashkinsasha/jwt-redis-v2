import * as redis from "redis";


export default class Redis {

    constructor(private readonly redisClient: redis.RedisClient) {
    }


    public set(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.redisClient.set(key, value,(err: Error) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    public setExp(key: string, value: string, mode: string, duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.redisClient.set(key, value, mode, duration, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    public del(key: string): Promise<void>{
        return new Promise((resolve, reject)=>{
            return this.redisClient.del(key, (err: Error)=>{
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    public get(key: string): Promise<string | undefined>{
        return new Promise((resolve, reject)=>{
            return this.redisClient.get(key, (err: Error, jsonDecode?: string) => {
                if(err){
                    return reject(err);
                }
                return resolve(jsonDecode);
            })
        });
    }
}