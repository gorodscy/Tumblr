var https = require('https');

var get_options = {
	host : 'api.tumblr.com', // here only the domain name
    // (no http/https !)
    port : 443,
    // the rest of the url with parameters if needed
    path : '/v2/blog/ystallonne.tumblr.com/likes?api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp', 
    method : 'GET' // do GET
};

// do the GET request
var get_request = https.request(get_options, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//    console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
        console.log(d);
        var j = JSON.parse(d);
        console.log(j);
        
       
        
    });
});

get_request.end();
get_request.on('error', function(e) {
    console.error(e);
});