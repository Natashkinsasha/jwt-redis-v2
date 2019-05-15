import * as chai from 'chai';
import * as redisMock from 'redis-mock';
import JWTRedis from '../src/index';
import {generateId} from "./util";

describe('Test decode', () => {

    const {expect} = chai;

    let jwtRedis: JWTRedis;

    before(() => {
        const redisClient = redisMock.createClient();
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
                expect(payload.jti).to.be.deep.equal(decoded.jti);
                done();
            })
            .catch(done);
    });

});