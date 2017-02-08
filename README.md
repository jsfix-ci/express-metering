# express-metering
![](https://api.travis-ci.org/chartotu19/express-metering.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/chartotu19/express-metering/badge.svg?branch=master)](https://coveralls.io/github/chartotu19/express-metering?branch=master)

simple express middleware to meter api requests.


## Installation
This repository is available in [npm](https://npmjs.org) repository. It needs node v4 or higher.
```
$ npm install express-metering
```
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
To use mongoStore instead of default memoryStore, use the following code. MongoStore persists data and protects metering info against server crashes. It unfortunately adds 1 DB access call which in turn adds ~100ms to your API call latency. 
```javascript
var app = express();
var metering = require('express-metering');

var store = new metering.mongoStore({
  uri: "mongodb://user:password@1.2.3.4/db_name"
});
app.use( metering.meter({
  store : store
}) );
```

## Options
name | Default | description
------------ | ------------- | -------------
proxy | false | express server behind proxy, true remote address will be found in header ( default header : `x-forwarded-for`)
proxyForwardedHeader | x-forwarded-for | header name set by proxy server containing true client remote address
store | memoryStore | Store used to store api request counts. Default store keeps data in memory.
clientIdPath | "client.id" | The nested path in `req` object where client ID where the request originated. Each API request is stored against a clientID.

## Stores

Currently the package supports `memoryStore` and `mongoStore`. Support for the following stores is planned for near future releasese:
* Redis
* Memcached
* Mysql
