var Store = require('./Store');

var MemoryStore = function () {};

MemoryStore.prototype = new Store();

var clientIds =
/*
 key format
 remoteAddress::::YYYY-MM-DD:HH
 */
MemoryStore.prototype.get = function (payload) {
    return Promise.resolve(this.store[payload.clientId+"/"+payload.remoteAddress+'/'+payload.utcHour]);
};

MemoryStore.prototype.incr = function (payload) {
    var key = payload.clientId+"/"+payload.remoteAddress+"/"+payload.utcHour;
    this.store[key] = this.store[key] || 0;
    this.store[key] += payload.increment;
    return Promise.resolve({
        count: this.store[key]
    });
};

MemoryStore.prototype.reset = function () {
    this.store = {};
};

module.exports = MemoryStore;