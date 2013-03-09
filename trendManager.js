// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

function trendBlog (req, res){
	var hostname = req.params.hostname;
	
	console.log("Must retrieve the trends for ", hostname);
	
	db.getBlog(hostname, function(blogs){
		console.log(blog);
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