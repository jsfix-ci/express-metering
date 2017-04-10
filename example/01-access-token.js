var express = require('express');
var expressMeter = require('../index');

var app = express();

app.use(function(req,res,next){
    req.customObj = {
        accessToken: "accesstoken-" + Math.floor((Math.random() * 10) + 1)
    };
    next();
});


// app.enable('trust proxy');

app.use(expressMeter({
    strategy : {
        type : "access-token",
        paths : {
            accessToken : "customObj.accessToken"
        }
    },
    requestsPerBucketSize:10
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
app.listen(3000);
console.log('server started on port 3000. visit http://localhost:3000/count');