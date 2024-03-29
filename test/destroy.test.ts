import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised'
import JWTRedis, {TokenDestroyedError} from '../src/index';
import {generateId} from "./util";
import {RedisClientType} from "redis";
import * as redis from "redis";

describe('Test destroy', () => {

    const {expect} = chai;
    chai.use(chaiAsPromised);

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
                return jwtRedis.destroy(payload.jti)
                    .then((is)=>{
                        expect(is).to.equal(true);
                        expect(jwtRedis.verify(token, key)).to.be.rejectedWith(TokenDestroyedError);
                        done();
                    })
            })
            .catch(done);
    });

    it('2', () => {
        return jwtRedis.destroy('jti')
            .then((is) => {
                expect(is).to.equal(false);
            })
    });

});
