var mongoose = require('mongoose');
var Store = require('./Store');

var MongoStore = function (options) {
    this.collectionName = options.collectionName || "apiMetering";
    var store = {};

    mongoose.connect(options.uri, options) ;
    mongoose.set('debug', true);
    var collectionSchema = new mongoose.Schema({
        remoteAddress : {
            type : String
        },
        clientId : {
            type : String
        },
        count : {
            type: Number
        },
        utcHour : {
            type : String
        }
    });
    collectionSchema.index({remoteAddress: 1, clientId: 1, utcHour:1}, {unique: true});
    this.model = mongoose.model(this.collectionName, collectionSchema);

};

MongoStore.prototype = new Store();
MongoStore.prototype.constructor = MongoStore;

/**
 *
 * @param payload
 * @return {*|Query}
 */
MongoStore.prototype.get = function (payload) {
    return this.model.findOne({remoteAddress:payload.remoteAddress, utcHour:payload.utcHour});
};

/**
 *
 * @param payload
 * @return {Promise}
 */
MongoStore.prototype.incr = function (payload) {
    var key = payload.remoteAddress + "/" + payload.utcHour;
    var self = this;
    return this.get(payload)
        .then(function (res) {
            var baseCount = 0;
            if( res != null){
                baseCount = res.count || 0;
            }
            return self.model.findOneAndUpdate(
                {remoteAddress: payload.remoteAddress, utcHour: payload.utcHour, clientId:payload.clientId},
                {count: baseCount + payload.increment},
                {upsert: true, new:true}
            );
        });
};


MongoStore.prototype.reset = function () {
    return this.model.remove({});
};

module.exports = MongoStore;