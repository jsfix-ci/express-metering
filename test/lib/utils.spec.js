var assert = require('assert');
var express = require('express');
var request = require('supertest');

var utils = require('../../lib/utils');


describe('utils',function () {

    beforeEach(function () {
    });

    describe('getUTCHourIndex',function () {
        it('should throw error on invalid input date object',function (done) {
            try{
                utils.getUTCHourIndex({});
            } catch(e){
                assert.equal(e.message,"invalid date input");
                done();
            }
        });
        it('should process valid ISO dateString',function (done) {
            var index = utils.getUTCHourIndex('2017-02-07T20:49:21.913Z');
            assert.equal(index, "2017-1-7/20");
            done();
        });
        it('should throw error invalid ISO dateString',function (done) {
            try{
                var index = utils.getUTCHourIndex('invalid_date');
            } catch(e){
                assert.equal(e.message,"invalid date input");
                done();
            }
        });
    })
});