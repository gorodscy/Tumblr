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

	if(order == 'Trending'){
		Trending(hostname, function(posts){
			// Send JSON to the client
			res.on('data', function(posts){
				console.log('Sending json back');
			});		
		});
	}
	else if(order == 'Recent'){
		Recent(hostname, function(posts){
			// Send JSON to the client
			res.on('data', function(posts){
				console.log('Sending json back');
			});		
		});
	}
	else {
		res.send(404);
	}
	
	console.log("Must retrieve the trends for ", hostname);
	
	res.send(200);
}

function trendAll (req, res){
	
	console.log("Must retrieve all trends being tracked");
	if(order == 'Trending'){
		// How nany interations
		for(var i=0; i< blog_list.count; i++){
			res.on( 'data', function()
				Trending(hostname);
				);
		}
	}
	else if(order == 'Recent'){
		Recent(hostname);
	}
	else {
		res.send(404);
	}
	
	
	res.send(200);
}