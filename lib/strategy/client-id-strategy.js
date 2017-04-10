var utils = require('../utils');
var Store = require('../stores/Store');
module.exports = function (req, options, store) {

    if( typeof req !== 'object'){
        throw new Error("invalid req object passed");
    }
    if( utils.getDescendantProp(options,"strategy.paths.clientId") == undefined){
        throw new Error("Config Error : invalid options.strategy passed");
    }
    if( !(store instanceof Store) ){
        throw new Error("Config Error : invalid store passed");
    }

    // get request information
    var remoteAddress = req.connection.remoteAddress;
    
    if(!remoteAddress){
        throw new Error("invalid request, connection remoteAddress missing");
    }

    // https://en.wikipedia.org/wiki/IPv6#IPv4-mapped_IPv6_addresses
    remoteAddress = remoteAddress.replace(/^.*:/, '');


    // extract clientId for the request.
    var clientId = options.strategy.defaultClientId || utils.getDescendantProp(req,options.strategy.paths.clientId);

    if(clientId == null || clientId == undefined){
        throw new Error("invalid clientId found in req object - "+clientId+" at path - req."+ options.strategy.paths.clientId);
    }
    var payload = {
        utcHour : utils.getUTCHourIndex(new Date()),
        remoteAddress : remoteAddress,
        clientId : clientId
    };
    return store.incr({
        key : payload.clientId+"/"+payload.remoteAddress+"/"+payload.utcHour,
        increment: 1
    })
};