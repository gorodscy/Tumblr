// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePosts = writePosts;
module.exports.readPosts = readPosts;

var fs = require('fs');

// Writing many posts in a file:
function writePosts(posts){
	var string = JSON.stringify(posts);
	var fs = require('fs');
	
	//get Timestamp
	var timestamp=new Date();
	
	// For the future: Save the timestamp and append instead of writing, to keep track
	/*
	fs.appendFile('posts.txt', timestamp.toString(), function (err) {
		if (err) throw err;
	});
	fs.appendFile('posts.txt', string, function (err) {
	  	if (err) throw err; 
	});
	*/
	fs.writeFile('posts.txt', string, function (err) {
	  	if (err) throw err; 
	});
}

// Reading posts from a file:
function readPosts(){
	fs.readFile('posts.txt', function (err, data) {
		if (err) throw err; {
			var j = JSON.parse(data); 
			
			var posts = j.response.liked_posts;
			var liked = j.response.liked_count;
			// For each post liked by the user (Limited to the last 20 posts)
			for(var i=0; i<liked && i<20; i++){

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
		}
	});
}