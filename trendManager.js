// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;


function trendBlog (req, res){

}

function trendAll (req, res){
	
	db.getPostbyPopularity(function(posts){
		
		console.log(posts);
		
	});

	res.send(200);
}