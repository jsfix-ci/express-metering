var express = require('express');
var expressMeter = require('../index');

var app = express();


app.use(expressMeter.meter());

app.get('/count',function (req, res, next) {
   return res.json({count : req.meter.count });
});

app.listen(3000);
console.log('server started on port 3000. visit http://localhost:3000/count');