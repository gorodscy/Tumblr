// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;


function trendBlog (req, res){
	var hostname = req.params.hostname;
	var order = req.params.order;

	console.log("Retrieve the trends for ", hostname);	

	// Return an error if the order does not match
	if(order != 'Trending' | order != 'Recent') {
		console.log("URL is wrong");
		res.send(404);
	}


	db.getAllPosts(blog.hostname, function(posts) {
		console.log();

		// Order by the the date of like
		if(order == 'Recent'){
			
			db.getPreviousTrack(post[i], function(track) { 
				
			});

			// Send JSON to the client
			res.on('data', function(posts){
				console.log('Sending json back');
			});				
		}
		// Order by the difference of likes
		else {
			// Send JSON to the client
			res.on('data', function(posts){
				console.log('Sending json back');
			});
		}
	});
	
	
	res.send(200);
}

function trendAll (req, res){
	
	console.log("Retrieve all trends being tracked");

	// Return an error if the order does not match
	if(order != 'Trending' | order != 'Recent') {
		console.log("URL is wrong");
		res.send(404);
	}

	db.getAllBlogs(function(blogs){
		console.log(blogs);
		var i =0;
		for(var i = 0; blogs[i] != undefined; i++) {
			db.getAllPosts(blogs[i].hostname, function(posts) {
				// Order by the the date of like
				if(order == 'Recent'){
					
				}
				// Order by the difference of likes
				else {
					
				}
			});
		}
	});

	res.send(200);
}