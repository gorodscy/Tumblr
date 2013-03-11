// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

var allPosts = JSON.parse('{"trending":[]}');

function trendBlog (req, res){

}

function trendAll (req, res){
	
	db.getPostbyPopularity(20, function(posts, i, end){
		
		//posts.order = 'Trending';
		//console.info(posts);
		
		allPosts.trending[i] = posts;
		
		if(i == end)
			res.send(allPosts);
		
	});
	
	
	
}