var Store = require('./Store');

var MemoryStore = function () {};

MemoryStore.prototype = new Store();

/*
 key format
 remoteAddress::::YYYY-MM-DD:HH
 */
MemoryStore.prototype.get = function (key) {
    return Promise.resolve(this.store[key]);
};

MemoryStore.prototype.incr = function (payload) {
    this.store[payload.key] = this.store[payload.key] || 0;
    this.store[payload.key] += payload.increment;
    return Promise.resolve({
        count: this.store[payload.key]
    });
};

MemoryStore.prototype.reset = function () {
    this.store = {};
};

module.exports = MemoryStore;