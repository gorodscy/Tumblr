// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

function trendBlog (req, res){

}

function trendAll (req, res){
	
	db.getPostbyPopularity(2, function(posts){
		
		posts.order = 'Trending';
		console.info(posts);
	});

	res.send(200);
}