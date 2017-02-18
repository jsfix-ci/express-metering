module.exports = {
    /*
        set this value to true, if express application is running behind a proxy like nginx.
    */
    proxy : false,
    debug : false,
    strategy: {
        type :  "access-token",
        paths : {
            "accessToken" : "accessToken"
        }
    },
    /*
     strategy: {
         type :  "client-id",
         proxyForwardedHeader : "x-forwarded-for",
         defaultClientId: "example-client-id"
         paths : {
            "clientId" : "req.client.id"
         }
     }
    */
    returnHeaders : true
};