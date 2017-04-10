var memoryStore = require('./memory-store');
var mongoStore = require('./mongo-store');
var redisStore = require('./redis-store');

module.exports = {
    get : function (options) {
        switch(options.type) {
            case "mongo":
                return new mongoStore(options);
            case "redis":
                return new redisStore(options);
            case "memory":
                return new memoryStore(options);
            default:
                return new memoryStore(options);
        }
    }
};