import * as chai from 'chai';
import * as redisMock from 'redis-mock';
import JWTRedis from '../src/index';
import {generateId} from "./util";

describe('Test sign', () => {

    const {expect} = chai;

    let jwtRedis: JWTRedis;

    before(() => {
        const redisClient = redisMock.createClient();
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