// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;



function Trending(hostname, cb){
	// Get from DB the list of posts ordered 
	// by the difference of the 2 last tracking
	cb(resposta-DB);

}

function Recent(hostname){
	// Get from DB the list of posts ordered 
	// by the difference of the 2 last tracking
	cb(resposta-DB);	

}


function trendBlog (req, res){
	var hostname = req.params.hostname;
	var order = req.params.order;

	console.log("Retrieve the trends for ", hostname);	

	if(order != 'Trending' | order != 'Recent') {
		console.log("URL is wrong");
		res.send(404);
	}

	db.getBlog(hostname, function(blog){
		console.log(blog);
		
		db.getAllPosts(hostname, function(posts) {
			// Order by the difference of likes
			if(order == 'Recent'){
				// Send JSON to the client
				res.on('data', function(posts){
					console.log('Sending json back');
				});				
			}
			// Order by the the date of like
			else {
				// Send JSON to the client
				res.on('data', function(posts){
					console.log('Sending json back');
				});
			}

		});
	});

	
	res.send(200);
}

function trendAll (req, res){
	
	console.log("Retrieve all trends being tracked");

	if(order != 'Trending' | order != 'Recent') {
		console.log("URL is wrong");
		res.send(404);
	}

	db.getAllBlogs(function(blogs){
		console.log(blogs);
		var i =0;
		for(var i = 0; blogs[i] != undefined; i++) {
			db.getAllPosts(blogs[i].hostname, function(posts) {
				if(order == 'Recent'){
					// Order by the difference of likes
					
				}
				else {
					// Order by the the date of like
					
				}
			});
		}
	});

	res.send(200);
}