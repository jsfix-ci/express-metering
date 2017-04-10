var assert = require('assert');
var express = require('express');
var request = require('supertest');

var expressMeter = require('../index');

function createServer(options) {
    var app = express();
    app.use(function (req,res,next) { req.accessToken = "access-token-value-here"; next()});
    app.use(expressMeter(options));
    app.use(function(req, res) {  res.json({count : req.meter.count}); });
    // app.listen()
    return app;
}

describe('express-metering',function () {

    beforeEach(function () {

    });

    it('throws error if invalid OPTIONS config passed',function (done) {
        try{
            expressMeter("invalid_options_type");
        } catch(e){
            assert.equal(e.message, "invalid options type passed - string");
            done();
        }
    });

    it('throws error if invalid strategy.type config passed',function (done) {
        try{
            expressMeter({
                strategy : {
                }
            });
        } catch(e){
            assert.equal(e.message, "invalid strategy.type passed");
            done();
        }
    });

    it('throws error if invalid STORE config passed',function (done) {
        try{
            expressMeter({
                store : "invalid_store"
            });
        } catch(e){
            assert.equal(e.message, "invalid store.type passed");
            done();
        }
    });

    describe('default options', function () {
        it('should store request count in req object, default memoryStore used', function(done){
            var app = createServer({});
            request(app)
                .get('/')
                .expect(200, {count:1}, done);
        });
    });

    /*describe('proxy option', function () {

        describe('when enabled', function () {
            it('should process x-forwarded-for header', function (done) {
                var app = createServer();
                app.enable('trust proxy');
                // request(app)
                //     .get('/')
                //     // .set('X-Forwarded-For', '12.12.12.12')
                //     // .expect(shouldNotHaveHeader('Set-Cookie'))
                //     .expect(200, {count:1}, function () {});

                // request(app)
                //     .get('/')
                //     // .set('X-Forwarded-For', '13.13.13.13')
                //     // .expect(shouldNotHaveHeader('Set-Cookie'))
                //     .expect(200, {count:1}, function () {});

                request(app)
                    .get('/')
                    // .set('X-Forwarded-For', '12.12.12.12')
                    // .expect(shouldNotHaveHeader('Set-Cookie'))
                    .expect(200, {count:2}, done)
            });

            // it('should process user supplied header', function (done) {
            //     var app = createServer({
            //         proxy: true,
            //         proxyForwardedHeader:"x-proxy-remote-address"
            //     });
            //
            //     request(app)
            //         .get('/')
            //         .set('X-Forwarded-For', '14.14.14.14')
            //         // .expect(shouldNotHaveHeader('Set-Cookie'))
            //         .expect(200, {count:1}, function () {});
            //
            //     request(app)
            //         .get('/')
            //         .set('x-proxy-remote-address', '14.14.14.14')
            //         // .expect(shouldNotHaveHeader('Set-Cookie'))
            //         .expect(200, {count:1}, function () {});
            //
            //     request(app)
            //         .get('/')
            //         .set('x-proxy-remote-address', '14.14.14.14')
            //         // .expect(shouldNotHaveHeader('Set-Cookie'))
            //         .expect(200, {count:2}, done)
            // });

            // it('should throw warning for missing header', function () {
            //
            // });
        });
        describe('when disabled', function () {
            // it('should ignore x-forwarded-for header',function (done) {
            //     var app = express();
            //     app.use(expressMeter.meter({
            //         proxy: false
            //     }));
            //     app.use(function(req, res) { res.json({count : req.meter.count}); });
            //     request(app)
            //         .get('/')
            //         .set('X-Forwarded-For', '15.15.15.15')
            //         // .expect(shouldNotHaveHeader('Set-Cookie'))
            //         .expect(200, {count:1}, function () {});
            //     request(app)
            //         .get('/')
            //         .set('X-Forwarded-For', '16.16.16.16')
            //         // .expect(shouldNotHaveHeader('Set-Cookie'))
            //         .expect(200, {count:2}, done);
            // });

        });

    });*/
    
    describe('client-id', function () {
        describe('when enabled', function () {
            it('should get clientId from the options path',function (done) {
                var app = express();
                app.use(function (req,res,next) {
                    req.client = {
                        id : 'client-id2'
                    };
                next()
                });
                app.use(expressMeter({
                    strategy:{
                    type:"client-id",
                    paths : {
                        clientId: "client.id"
                        }
                    }
                }));
                app.use(function(req, res) { res.json({count : req.meter.count}); });
                
                request(app)
                .get('/')
                .expect(200, {count:1}, function () {});
                
                request(app)
                .get('/')
                .expect(200, {count:2}, done);
            });
        });
    });
    
    it("throw ratelimiting error when the requests reaches bucketSize",function (done) {
     var app = express();
     app.use(function (req,res,next) {
         req.client = {
             id : 'client-id'
         };
         next();
     });
     app.use(expressMeter({
         strategy:{
             type:"client-id",
             paths : {
                 clientId: "client.id"
             }
         },
         requestsPerBucketSize:2
     }));
     app.use(function(req, res) { res.json({count : req.meter.count}); });
     app.use(function ( err, req, res, next ) {
        if(err.httpCode){
            return res.status(err.httpCode).end();
        }
        return res.status(500).end();
     });
     request(app)
         .get('/')
         .expect(200, {count:1}, function () {});
     
     request(app)
         .get('/')
         .expect(200, {count:2}, function () {});
     request(app)
         .get('/')
         .expect(429, done);
    })
});
