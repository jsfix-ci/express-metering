module.exports = function () {
    this.store = {};
    
    this.get = function () {
        console.warn("Your store doesnt have an implementation for get() method.")
    };

    this.incr = function () {
        console.warn("Your store doesnt have an implementation for incr() method.")
    };

    this.reset = function () {
        console.warn("Your store doesnt have an implementation for reset() method.")
    };
};