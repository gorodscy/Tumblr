// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePosts = writePosts;
module.exports.readPosts = readPosts;
module.exports.saveBlog = saveBlog;
module.exports.readBlogs = readBlogs;

var blog_count = 0;

// Write blog track list
function saveBlog(blog_list, url){
	var fs = require('fs');
	
	var string = '{"count":' + (blog_count+1) + ',';
	// If first blog saved
	if(blog_count == 0){
	 	string += '"blog":["' + url + '"]}';
	 }
	 else {
	 	for(var i=0; i<=blog_count; i++){
	 		// If first URL
			if(i==0){
				string += '"blog":[' + JSON.stringify(blog_list.blog[i]);
			}
			// If last URL
			else if(i==blog_count){
				string += ',"' + url + '"]}';
			}
			// Otherwise
			else {
				string += ',' + JSON.stringify(blog_list.blog[i]);
			}
	 	}
	 }
	
	fs.writeFile('blogs.txt', string, function (err) {
		if(err) throw err;
	});
	
	// Update blog_list:
	blog_list = JSON.parse(string);
	
	blog_count += 1;
	return JSON.parse(string);
}

// Read blog track list
function readBlogs(blog_list){
	var fs = require('fs');
	
	fs.readFile('blogs.txt', function (err, data) {
		if(err) throw err;
		
		var count = 0;
		var j = JSON.parse(data, reviver);
		
		// Function to count how many blogs has been tracked
		function reviver(key, value){
			if(typeof value === 'string'){
				count += 1;
			}
			return value;
		}
		
		blog_list = j;
		
		//console.log(JSON.stringify(blog_list.blog[0]));
		return count;
		
	});
}

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
	
	var fs = require('fs');
	
	fs.readFile('posts.txt', function (err, data) {
		if (err) throw err; 
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
		
	});
}