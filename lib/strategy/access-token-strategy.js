'use strict';

/*
    Strategy
    - uses options.strategy.paths to identify the variables to measure and index the APIs against.
    - defines the persistence store schema, creates a store instance using it.
    - increments count for the API
*/
var utils = require('../utils');
var Store = require('../stores/Store');

module.exports = function (req, options, store) {

    if( typeof req !== 'object'){
        throw new Error("invalid req object passed");
    }
    if( utils.getDescendantProp(options,"strategy.paths.accessToken") == undefined){
        throw new Error("Config Error : invalid options.strategy passed");
    }
    if( !(store instanceof Store) ){
        throw new Error("Config Error : invalid store passed");
    }
    var accessToken = null;

    if( options.strategy.paths.accessToken ){
        accessToken = utils.getDescendantProp(req, options.strategy.paths.accessToken);
    }

    if( !accessToken ){
        throw new Error("invalid accessToken found in req object - "+accessToken+" at path - req."+options.strategy.paths.accessToken);
    }
    return store.incr({
        key : utils.getUTCHourIndex(new Date())+'/'+accessToken,
        increment: 1
    })
};