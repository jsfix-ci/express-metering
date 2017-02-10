# express-metering
![](https://api.travis-ci.org/chartotu19/express-metering.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/chartotu19/express-metering/badge.svg?branch=master)](https://coveralls.io/github/chartotu19/express-metering?branch=master)

simple express middleware to meter api requests.


## Installation
This repository is available in [npm](https://npmjs.org) repository. It needs node v4 or higher.
```
$ npm install express-metering
```
## Usecase
This package is intended for a API service which servers single or multiple clients using express framework. It will meter(or measure)the requests made from a remote address per client_id per hour. `express-metering` will have a request throttling component very soon.
* Requests throttling per client per hour for overall health of the service. (future planned release)
* To identify malicious request origins which bombarding your service with requests. 
* To identify and isolate key restful resources which are accessed more than others.

## Usage
Each API request is stored in bucket uniquely identified by. 
* `ip`- remote address
* `clientId` - An application probably serve multiple clients
* `utcHour`

To use this package, simply pass the middleware in the express middleware chain before the routes.
```javascript
var app = express();
var metering = require('express-metering');

// default configuration 
app.use( metering.meter() );

```
The middleware attaches the count/hour/client to the `req` object to be accessed down the middleware chain. To access the value downstream:
```javascript
console.log(req.meter.count); // contains an Integer count of number of requests for the client in the last utcHour.
```


To use other stores instead of default memoryStore, scroll down to see `Stores` section. 


## Options
name | Default | description
------------ | ------------- | -------------
proxy | false | express server behind proxy, true remote address will be found in header ( default header : `x-forwarded-for`)
proxyForwardedHeader | x-forwarded-for | header name set by proxy server containing true client remote address
store | memoryStore | Store used to store api request counts. Default store keeps data in memory.
clientIdPath | "client.id" | The nested path in `req` object where client ID where the request originated. Each API request is stored against a clientID.

## Stores

Stores persist the request counts against each remote address(ip)/ hour. Currently this package supports :
* **memoryStore**
```javascript
  var app = express();
  var expressMetering = require('express-metering');
  app.use( expressMetering.meter() );
```

* **mongoStore**
MongoStore persists data and protects metering info against server crashes. It unfortunately adds 1 DB access call which in turn adds ~100ms to your API call latency. 
```javascript
  var app = express();
  var expressMetering = require('express-metering');
  var store = new expressMetering.mongoStore({
    uri : "mongodb://username:password@mongo_server_ip/db_name"
  });
  app.use( expressMetering.meter({ store: store }) );
```
* **redisStore**
```javascript
  var app = express();
  var expressMetering = require('express-metering');
  var store = new expressMetering.redisStore({
    host : "redis_url",
    port : redis_port || 6379
  });
  app.use( expressMetering.meter({ store: store }) );
```

Support for the following stores is planned for near future releasese:
* Memcached
* Mysql
