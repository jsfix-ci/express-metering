module.exports = {
    /*
        set this value to true, if express application is running behind a proxy like nginx.
    */
    proxy : false,
    debug : false,
    proxyForwardedHeader : "x-forwarded-for",
    returnHeaders : true,
    throttling : true,
    throttlingBucket : "HOUR",
    defaultClientId: "example-client-id"
};