// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

var allPosts = JSON.parse('{"trending":[]}');

var countPost = 0;

function trendBlog (req, res){
	
	// Get the params
	var limit = req.params.limit;
	var order = req.params.order;
	var hostname = req.params.hostname;
	
	// Check if limit not set
	if(limit == undefined || limit > 20){
		limit = 20;
	}
	
	if(order.toUpperCase() == 'TRENDING'){
	
		db.getBlogPostbyPopularity(hostname, limit, chunkPost);
	}
	else if (order.toUpperCase() == 'RECENT'){
		db.getBlogPostRecent(hostname, limit, chunkPost);
	}
	
	function chunkPost(posts, end){
	
		if(posts == 404){
			res.send(404);
			return;
		}
		
		allPosts.trending[countPost] = posts;

		countPost += 1;

		// Last post
		if(countPost == end){

			// Order and limit just need to be set once
			allPosts.order = order;
			allPosts.limit = limit;
		
			// Reset count
			countPost = 0;
			// Send the result to user
			res.send(allPosts);
			allPosts = JSON.parse('{"trending":[]}');
		}		
	}
	
}

function trendAll (req, res){
	
	// Get the params
	var limit = req.params.limit;
	var order = req.params.order;
	
	// Check if limit not set
	if(limit == undefined || limit > 20){
		limit = 20;
	}
	
	if(order.toUpperCase() == 'TRENDING'){
	
		db.getPostbyPopularity(limit, chunkPost);
	}
	else if (order.toUpperCase() == 'RECENT'){
		db.getPostRecent(limit, chunkPost);
	}
	
	function chunkPost(posts, end){
	
		if(posts == 404){
			res.send(404);
			return;
		}
	
		allPosts.trending[countPost] = posts;

		countPost += 1;

		// Last post
		if(countPost == end){

			// Order and limit just need to be set once
			allPosts.order = order;
			allPosts.limit = limit;
		
			// Reset count
			countPost = 0;
			// Send the result to user
			res.send(allPosts);
			allPosts = JSON.parse('{"trending":[]}');
		}		
	}
	
}