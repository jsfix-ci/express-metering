var accessTokenStrategy = require('./access-token-strategy');
var clientIdStrategy = require('./client-id-strategy');

module.exports = {
    get : function (strategyName) {
        switch(strategyName) {
            case "access-token":
                return accessTokenStrategy;
            case "client-id":
                return clientIdStrategy;
        }
    }
};