var https = require('https');
var url = 'https://api.tumblr.com/v2/blog/gorodscy.tumblr.com/likes?\
api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp';


// do the GET request
var get_request = https.get(url, function(res) {

	//Uncomment for DEBUG:
    //console.log("statusCode: ", res.statusCode);
	//console.log("headers: ", res.headers);
	
	// Create a variable to accumulate data.
	// It is necessary because the data could be to long.
	// Otherwise it could only be possible to receive two posts.
	var data = '';

    res.on('data', function (chunk) {
    
    	data += chunk;
	});
	
	// After all data is accumulated
	res.on('end', function () {
        
        // Parse the data to JSON Object
        var j = JSON.parse(data);
  		
  		// Retrieve the information and store in variables
		var posts = j.response.liked_posts;
		var liked = j.response.liked_count;
 
		// For each post liked by the user (Limited to the last 20 posts)
		for(var i=0; i<liked; i++){

			/// Display post information:

			console.info('#-------------------------------------#');
			console.info('Post #', i, ':');
	
			console.info('>>	URL: ', posts[i].post_url);
			console.info('>>	DATE: ', posts[i].date);
			if(posts[i].type == 'photo') {
				console.info('>>	PHOTO: ', posts[i].photos);
			} else if(posts[i].type == 'text') {
				console.info('>>	TITLE: ', posts[i].title);
				console.info('>>	TEXT: ', posts[i].body);
			}
			console.info('>>	NOTE COUNT (likes): ', posts[i].note_count);
	
			// If this is the last post
			if(i == liked-1)
				console.info('#-------------------------------------#');
				
			/// Finish displaying post information
		}
        
    });

});

get_request.end();
get_request.on('error', function(e) {
    console.error(e);
});