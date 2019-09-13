import * as chai from 'chai';
import * as redisMock from 'redis-mock';
import JWTRedis, {TokenDestroyedError} from '../src/index';
import {generateId} from "./util";
import {TokenExpiredError} from "jsonwebtoken";
import * as chaiAsPromised from "chai-as-promised";

describe('Test destroy', () => {

    const {expect} = chai;
    chai.use(chaiAsPromised);

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
                return jwtRedis.verify(token, key);
            })
            .then(()=>{
                done();
            })
            .catch(done);
    });

    it('2', (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        jwtRedis.sign(payload, key, {expiresIn: '1d'})
            .then((token: string) => {
                return jwtRedis.verify<{jti: string}>(token, key);
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
        const payload = {jti: generateId(10)};
        jwtRedis.sign(payload, key, {expiresIn: '0s'})
            .then((token: string) => {
                expect(jwtRedis.verify<{jti: string}>(token, key)).to.be.rejectedWith(TokenExpiredError);
                done();
            })
            .catch(done);
    });

    it('4', (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10), exp: new Date().getSeconds()};
        jwtRedis.sign(payload, key)
            .then((token: string) => {
                expect(jwtRedis.verify<{jti: string}>(token, key)).to.be.rejectedWith(TokenExpiredError);
                done();
            })
            .catch(done);
    });


});