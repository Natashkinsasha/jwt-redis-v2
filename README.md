# jwt-redis

This library completely repeats the entire functionality of the library [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), with one important addition.
Jwt-redis allows you to store the token label in redis to verify validity.
The absence of a token label in redis makes the token not valid. To destroy the token in **jwt-redis**, there is a destroy method.
This makes it possible to make a token not valid until it expires.
Jwt-redis support [node_redis](https://www.npmjs.com/package/redis) client.


# Installation

Npm
```javascript
npm install jwt-redis
```

Yarn
```javascript
yarn add jwt-redis
```

# Support

This library is quite fresh, and maybe has bugs. Write me an **email** to *natashkinsash@gmail.com* and I will fix the bug in a few working days.

# Quick start

```javascript
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
//ES6 import JWTR from 'jwt-redis';
var redisClient = redis.createClient();
await redisClient.connect();
var jwtr = new JWTR(redisClient);

var secret = 'secret';
var jti = 'test';
var payload = { jti };

// Create a token
jwtr.sign(payload, secret)
    .then(()=>{
            // Token verification
            return jwtr.verify(token, secret);
    })
    .then(()=>{
            // Destroying the token
            return jwtr.destroy(jti, secret);
    });
```

# Expiration time
You can set the lifetime of the token the same way as in the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.
The label in redis is deleted when the token expires.
```javascript
    // expiresIn - number of seconds through which the token will not be valid
    await jwtr.sign({}, 'secret', {expiresIn: expiresIn})
    // exp - time at which the token will not be valid
    await  jwtr.sign({exp: exp}, secret)
```

# Create jti

For each token, the claims are added **jti**. **Jti** is the identifier of the token.
You can decide for yourself what it will be equal by adding its values to payload.

```javascript
    var payload = {jti: 'test'};
    await jwtr.sign(payload, secret)
```

If **jti** is not present, then **jti** is generated randomly by the library.

# Destroy token

You can destroy the token through jti.

```javascript
    await jwtr.destroy(jti)
```


# Native Promise

All methods except the decode method (since it is synchronous) can return a native Promise.

```javascript
    jwtr
    .sign({}, secret)
    .then(function (token) {

    })
    .catch(function (err) {

    })
```

# Bluebird

If you want to use **Bluebird**, then after the promiscilation all the methods of the library will be available that return Promise,
Only at the end of each method should you add **Async**.

```javascript
    var Promise = require('bluebird');
    var Redis = require('ioredis');
    var redis = new Redis();
    var JWTR =  require('jwt-redis');
    var jwtr = new JWTR(redis);

    var jwtrAsync = Promise.promisifyAll(jwtr);

    jwtrAsync
    .signAsync({}, secret)
    .then(function (token) {

    })
    .catch(function (err) {

    })
```

# API

Method for creating a token.
### jwtr.sign(payload, secretOrPrivateKey, [options]): Promise<string> ###

Method for verifying a token
### jwtr.verify<T>(token, secretOrPublicKey, [options]): Promise<T> ###

Method for breaking the token
### jwtr.destroy(jti, [options]): Promise<void> ###

Method for decoding token
### jwt.decode<T>(token, [options]): T ###

jwt-redis fully supports all method options that support the library [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).
Therefore, it is better to read their documentation in addition. But there are several options that are available only in jwt-redis.

Also in the options you can specify a prefix for the redis keys. By default it is *jwt_label:*.

```javascript
var options = {
    prefix: 'example'
}
var jwtr = new JWTR(redis, options);
```

# TypesScript

This library have typing in module.
