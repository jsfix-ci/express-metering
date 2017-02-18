
var RateLimitingError = function () {
    this.name = "RateLimitingError";
    this.httpCode = 429;
};

RateLimitingError.prototype = new Error();

RateLimitingError.prototype.constructor = RateLimitingError;

exports.RateLimitingError = RateLimitingError;