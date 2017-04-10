var mongoose = require('mongoose');
var Store = require('./Store');

var MongoStore = function (options) {
    this.collectionName = options.collectionName || "apiMetering";
    var store = {};

    mongoose.connect(options.uri, options) ;
    if(options.debug){
        mongoose.set('debug', true);
    }

    var collectionSchema = new mongoose.Schema({
        key : {
            type : String
        },
        count : {
            type: Number
        }
    });
    collectionSchema.index({key:1}, {unique: true});
    this.model = mongoose.model(this.collectionName, collectionSchema);

};

MongoStore.prototype = new Store();
MongoStore.prototype.constructor = MongoStore;

/**
 *
 * @param payload
 * @return {*|Query}
 */
MongoStore.prototype.get = function (key) {
    return this.model.findOne({key:key});
};

/**
 *
 * @param payload
 * @return {Promise}
 */
MongoStore.prototype.incr = function (payload) {
    // var key = payload.remoteAddress + "/" + payload.utcHour;
    var self = this;
    return this.get(payload.key)
        .then(function (res) {
            var baseCount = 0;
            if( res != null){
                baseCount = res.count || 0;
            }
            return self.model.findOneAndUpdate(
                {key : payload.key},
                {count: baseCount + payload.increment},
                {upsert: true, new:true}
            );
        });
};


MongoStore.prototype.reset = function () {
    return this.model.remove({});
};

module.exports = MongoStore;