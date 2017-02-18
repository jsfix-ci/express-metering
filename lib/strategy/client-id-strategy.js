var utils = require('../utils');

module.exports = function (req, options, store) {

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
        console.warn("missing remoteAddress");
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
    var payload = {
        utcHour : utils.getUTCHourIndex(new Date()),
        remoteAddress : remoteAddress,
        clientId : clientId
    };
    return store.incr({
        utcHour : payload.clientId+"/"+payload.remoteAddress+'/'+payload.utcHour,
        increment: 1
    })
};