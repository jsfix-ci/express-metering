'use strict';

/*
    Strategy
    - uses options.strategy.paths to identify the variables to measure and index the APIs against.
    - defines the persistence store schema, creates a store instance using it.
    - increments count for the API
*/
var utils = require('../utils');

module.exports = function (req, options, store) {

    var accessToken = null;
    if( options.strategy.paths.accessToken ){
        accessToken = utils.getDescendantProp(req, options.strategy.paths.accessToken);
        console.log(req.accessToken,accessToken);
    }

    if( !accessToken ){
        throw new Error("invalid accessToken found for the request - "+accessToken+" at path - "+options.strategy.paths.accessToken);
    }

    return store.incr({
        key : utils.getUTCHourIndex(new Date())+'/'+accessToken,
        increment: 1
    })
};