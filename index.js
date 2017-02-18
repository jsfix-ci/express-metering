"use strict";

var Store = require('./lib/stores/Store');
var memoryStore = require('./lib/stores/memory-store');
var mongoStore = require('./lib/stores/mongo-store');
var redisStore = require('./lib/stores/redis-store');

var strategyFactory = require('./lib/strategy');

var utils = require('./lib/utils');
var errors = require('./lib/errors');
var defaultOptions = require('./lib/default-options');

var warning = function (msg) {
    console.warn(msg);
};

var meter = function (options){

    var options = options || {};

    if(typeof options != 'object'){
        throw new Error("invalid options type passed - "+ typeof options);
    }

    options = Object.assign({}, defaultOptions, options);

    //@todo : move store into strategy
    var store = options.store || new memoryStore({});

    if(!(store instanceof Store)){
        throw new Error('invalid store instance passed');
    }

    // warning message when running on production.
    if(process.env.NODE_ENV == 'production'){
        warning("DONT use memoryStore in production, possible data loss");
    }

    return function handler (req,res,next) {

        var strategy = strategyFactory.get(options.strategy.type);
        if(strategy == null){
            throw new Error('invalid strategy type - '+options.strategy.type);
        }
        console.log(strategy);
        return strategy(req, options, store)
            .then(function (doc) {
                if( options.debug ){
                    console.log("result : "+ doc.count);
                }
                //set count to request object, for downstream middlewares to access it.
                req.meter = {
                    count : doc.count
                };

                // request rate limiting
                /*if( doc.count > options.requestsPerBucketSize){
                    next(new errors.RateLimitingError());
                } else {
                    next();
                }*/
            }).catch(function (err) {
                console.error(err);
                next(err)
            });
    }
};

exports.meter = meter;

exports.mongoStore = mongoStore;
exports.memoryStore = memoryStore;
exports.redisStore = redisStore;