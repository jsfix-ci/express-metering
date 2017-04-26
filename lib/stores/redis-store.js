var Store = require('./Store');
var redis = require('redis');
var bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var RedisStore = function (options) {

    // connection
    this.client = redis.createClient(options);
    this.hashName = options.hashName;
};


RedisStore.prototype = new Store();

RedisStore.prototype.constructor = RedisStore;

/**
 *
 * @param {Object} payload
 * @return {Promise}
 */
RedisStore.prototype.get = function (key) {
    return this.client.hgetAsync(this.hashName,key);
};

RedisStore.prototype.incr = function (payload) {
    return this.client.hincrbyAsync(this.hashName,payload.key,payload.increment)
        .then(function (value) {
            return{
                count :value
            }
        })
};

module.exports = RedisStore;