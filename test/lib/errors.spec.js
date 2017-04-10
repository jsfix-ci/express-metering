var assert = require('assert');
var express = require('express');
var request = require('supertest');

var errors = require('../../lib/errors');


describe('errors',function () {
    
    it("has ratelimiting error type with httpCode = 429 and name=RateLimitingError",function(done){
        var e = new errors.RateLimitingError();
        assert.equal(e.httpCode,429);
        assert.equal(e.name,"RateLimitingError");
        assert.equal(e instanceof Error, true);
        done();
    })
});