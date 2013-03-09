// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

function trendBlog (req, res){
	var hostname = req.params.hostname;
	
	console.log("Must retrieve the trends for ", hostname);
	
	db.getBlog(hostname, function(blog){
		console.log(blog);
	});
	
	db.getAllPosts(hostname, function(posts){
		console.log(posts[0]);
		
		db.getLastTrack(posts[0], function(track){
			
			console.log(track);
			
		});
		
	});
	
	res.send(200);
}

function trendAll (req, res){
	
	console.log("Must retrieve all trends being tracked");
	
	db.getAllBlogs(function(blogs){
		console.log(blogs);
	});
	
	res.send(200);
}