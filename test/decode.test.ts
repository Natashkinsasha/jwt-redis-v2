import * as chai from 'chai';
import JWTRedis from '../src/index';
import {generateId} from "./util";
import {RedisClientType} from "redis";
import * as redis from "redis";

describe('Test decode', () => {

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
        const payload = {jti: generateId(10)};
        jwtRedis.sign(payload, key)
            .then((token: string) => {
                return jwtRedis.decode<{jti: string}>(token);
            })
            .then((decoded)=>{
                expect(decoded).to.have.property('iat');
                expect(payload.jti).to.be.deep.equal(decoded.jti);
                done();
            })
            .catch(done);
    });

    it('2', (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        jwtRedis.sign(payload, key, {expiresIn: '1d'})
            .then((token: string) => {
                return jwtRedis.decode<{jti: string}>(token);
            })
            .then((decoded)=>{
                expect(decoded).to.have.property('iat');
                expect(decoded).to.have.property('exp');
                expect(payload.jti).to.be.deep.equal(decoded.jti);
                done();
            })
            .catch(done);
    });

    it('3', (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10), exp: new Date().getSeconds()};
        jwtRedis.sign(payload, key)
            .then((token: string) => {
                return jwtRedis.decode<{jti: string}>(token);
            })
            .then((decoded)=>{
                expect(decoded).to.have.property('iat');
                expect(decoded).to.have.property('exp');
                expect(payload.jti).to.be.deep.equal(decoded.jti);
                done();
            })
            .catch(done);
    });

});