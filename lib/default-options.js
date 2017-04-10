module.exports = {
    /*
        set this value to true, if express application is running behind a proxy like nginx.
    */
    debug : false,
    strategy: {
        type :  "access-token",
        paths : {
            "accessToken" : "accessToken"
        }
    },
    store : {
        type: "memory"
    },
    /*
     strategy: {
         type :  "client-id",
         defaultClientId: "example-client-id"
         paths : {
            "clientId" : "req.client.id"
         }
     }
    */
    requestsPerBucketSize:100,
    returnHeaders : true
};