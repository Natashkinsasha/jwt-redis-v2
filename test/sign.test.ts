import * as chai from 'chai';
import JWTRedis from '../src/index';
import {generateId} from "./util";
import {RedisClientType} from "redis";
import * as redis from "redis";

describe('Test sign', () => {

    const {expect} = chai;

    let jwtRedis: JWTRedis;

    before(async () => {
        const redisClient: RedisClientType = redis.createClient({
            url: "redis://localhost:6379",
        });
        await redisClient.connect();
        jwtRedis = new JWTRedis(redisClient);
    });

    it('1', (done) => {
        const key = generateId(10);
        jwtRedis.sign({}, key)
            .then((token: string) => {
                expect(token).to.be.a('string')
                done();
            })
            .catch(done);
    });

});
