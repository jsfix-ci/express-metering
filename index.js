"use strict";

var Store = require('./lib/stores/Store');
var memoryStore = require('./lib/stores/memory-store');
var mongoStore = require('./lib/stores/mongo-store');
var redisStore = require('./lib/stores/redis-store');

var utils = require('./lib/utils');

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

    /*
    var entry = {
        utcHour : "",
        increment: 1,
        remoteAddress:"",
        clientId: ""
    };
    */

    var store = options.store || new memoryStore({});

    if(!(store instanceof Store)){
        throw new Error('invalid store instance passed');
    }

    // warning message when running on production.
    if(process.env.NODE_ENV == 'production'){
        warning("DONT use memoryStore in production, possible data loss");
    }

    return function handler (req,res,next) {

        // get request information
        var remoteAddress = req.connection.remoteAddress;

        if(options.proxy && options.proxyForwardedHeader){
            //check for default headers to avoid proxy header requests.
            var forwardedAddress = req.headers[options.proxyForwardedHeader];
            if(forwardedAddress == null){
                warning('missing proxyForwardedHeader in the header of the request. check your proxy configuration');
                req.meter = {
                    count : null
                };
                return next();
            }
            remoteAddress = forwardedAddress;
        }

        if(!remoteAddress){
            warning("missing remoteAddress");
            req.meter = {
                count : null
            };
            return next();
        }

        // https://en.wikipedia.org/wiki/IPv6#IPv4-mapped_IPv6_addresses
        remoteAddress = remoteAddress.replace(/^.*:/, '');


        // extract clientId for the request.
        var clientId = options.defaultClientId;
        if( options.clientIdPath ){
            clientId = utils.getDescendantProp(req,options.clientIdPath);
        }

        if(clientId == null || clientId == undefined){
            throw new Error("invalid clientId found for the request - "+clientId);
        }

        return store.incr({
            utcHour : utils.getUTCHourIndex(new Date()),
            clientId : clientId,
            increment: 1,
            remoteAddress:remoteAddress
        }).then(function (doc) {
            if( options.debug ){
                console.log("remoteAddress : "+remoteAddress);
                console.log("result : "+ doc.count);
            }
            //set count to request object.
            req.meter = {
                count : doc.count
            };
            next();
        }).catch(function (err) {
            console.log(err);
            next(err)
        });

        // //check for throttling
        // var hourlyCount = store.get(remoteAddress,'hour');
        // switch( options.bucketing){
        //     case "hour":
        //         break;
        //
        //     case "minute":
        //         break;
        // }

        //forward request.
    }
};

exports.meter = meter;

exports.mongoStore = mongoStore;
exports.memoryStore = memoryStore;
exports.redisStore = redisStore;