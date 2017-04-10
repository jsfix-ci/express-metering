"use strict";

var Store = require('./lib/stores/Store');
var storeFactory = require('./lib/stores');

var strategyFactory = require('./lib/strategy');

var utils = require('./lib/utils');
var errors = require('./lib/errors');
var defaultOptions = require('./lib/default-options');

module.exports = function (options){

    var options = options || {};

    if(typeof options != 'object'){
        throw new Error("invalid options type passed - "+ typeof options);
    }

    options = Object.assign({}, defaultOptions, options);

    var store = storeFactory.get(options.store);

    if(!utils.getDescendantProp(options,"store.type") ){
        throw new Error("invalid store.type passed");
    }
    if( !utils.getDescendantProp(options,"strategy.type") ){
        throw new Error("invalid strategy.type passed");
    }
    if(!(store instanceof Store)){
        throw new Error('invalid store type passed - '+options.store.type);
    }

    // warning message when running on production.
    if(process.env.NODE_ENV == 'production'){
        console.log("DON'T use memoryStore in production, possible data loss.");
    }

    return function handler (req,res,next) {

        var strategy = strategyFactory.get(options.strategy.type);
        if(strategy == null){
            throw new Error('invalid strategy type - '+options.strategy.type);
        }
        return strategy(req, options, store)
            .then(function (doc) {
                //if( options.debug ){
                //    console.log("result : "+ doc.count);
                //}
                //set count to request object, for downstream middlewares to access it.
                req.meter = {
                    count : doc.count
                };

                // request rate limiting
                if( doc.count > options.requestsPerBucketSize){
                    next(new errors.RateLimitingError());
                } else {
                    next();
                }
            }).catch(function (err) {
                console.error(err);
                next(err)
            });
    }
};