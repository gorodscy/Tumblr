// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePosts = writePosts;
module.exports.readPosts = readPosts;
module.exports.saveBlog = saveBlog;
module.exports.readBlogs = readBlogs;

// Write blog track list
function saveBlog(blog_list, url){
	var fs = require('fs');
	
	var blog_count = 0;
	
	if (blog_list != null){
		var blog_count = blog_list.count;
	}
	
	var string = '{"count":' + (blog_count+1) + ',';
	// If first blog
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
	
	fs.writeFileSync('blogs.txt', string);
	
	// Update blog_list:
	blog_list = JSON.parse(string);
	return JSON.parse(string);
}

// Read blog track list
function readBlogs(){
	var fs = require('fs');
	var j;
	
	j = fs.readFileSync('blogs.txt');
	return JSON.parse(j);
}

// Writing many posts in a file:
function writePosts(posts){
	var string = JSON.stringify(posts);
	var fs = require('fs');
	
	//get Timestamp
	var timestamp=new Date();
	
	// Insert timestamp
	//string = timestamp + string;
	
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