var express = require('express');
var expressMeter = require('../index');

var app = express();

app.use(function(req,res,next){
    req.customObj = {
        accessToken: "accesstoken-" + Math.floor((Math.random() * 10) + 1)
    };
    next();
});

app.use(expressMeter({
    strategy : {
        type : "access-token",
        paths : {
            accessToken : "customObj.accessToken"
        }
    },
    requestsPerBucketSize:10,
    store:{
        type    : "redis",
        host    : "dev-apps-cache.kwct6r.0001.usw2.cache.amazonaws.com",
        port    : 6379,
        hashName: "rate-limiting-mapping"
    }
}));

app.get('/count',function (req, res, next) {
   return res.json({count : req.meter.count });
});

app.use(function (err,req,res,next) {
    if( err.name == 'RateLimitingError'){
        return res.status(err.httpCode).json({
           error : "Too many requests sent from your client. Please try again after sometime"
        });
    }
    return next(err);
});
var port = 3000+parseInt((Math.random() * 10));
app.listen(port);
console.log('server started on port '+port+'. visit http://localhost:'+port+'/count');