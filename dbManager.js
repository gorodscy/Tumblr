db = require('mysql');

// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePost = writePost;
module.exports.readPosts = readPosts;
module.exports.saveBlog = saveBlog;
module.exports.readBlogs = readBlogs;
module.exports.createDB = createDB;

// Set up the connection
var connection = db.createConnection({
	host: 'localhost',
	port: 8889,
	database: "tumblr",
	user: 'gorodscy',
	password: '123'
});

function createDB() {
	// Establish the connection
	connection.connect();

	connection.query('DROP DATABASE IF EXISTS tumblr'); // It drops database if it already exists
	connection.query('CREATE DATABASE tumblr'); // Creating a database
	connection.query('USE tumblr');
	// Creating post table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `post` (' +
	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
	'`url` text NOT NULL,'+
	'`date` date NOT NULL,'+
	'`image` text NOT NULL,'+
	'`text` text NOT NULL,'+
	'`last_track` text NOT NULL,'+
	'`last_count` text NOT NULL,'+
	'PRIMARY KEY (`id`)'+ 
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	// Creating track table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `track` ('+
	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
	'`timestamp` date NOT NULL,'+
	'`sequence` int(11) NOT NULL,'+
	'`increment` int(11) NOT NULL,'+
	'`count` int(11) NOT NULL,'+
	'`id_post` int(11),'+
	'PRIMARY KEY (`id`)'+
	'FOREIGN KEY (`id_post`) REFERENCES `post` (`id`)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	// Creating blog table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `blog` ('+
	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
	'`hostname` text NOT NULL,'+
	'`like_count` int(11) NOT NULL,'+
	'`id_post` int(11) NOT NULL,'+
	'PRIMARY KEY (`id`)'+
	'FOREIGN KEY (id_post) REFERENCES post (id)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');

}

function closeDB(){
	// Finish the connection
	connection.end();
}

// Write blog on DB
function saveBlog(hostname, liked_count, liked_posts){
	
	connection.query('INSERT INTO blog (hostname, liked_count) VALUES (?, ?)', [hostname, liked_count]);
	
	for(var i=0; i<liked_count; i++) {
		writePost(liked_posts[i]);
	}
	
}

// Read blog track list
function readBlogs(){
	var fs = require('fs');
	var j;
	
	j = fs.readFileSync('blogs.txt');
	return JSON.parse(j);
}

// Writing post in DB:
function writePost(post){
	
	//get Timestamp
	var timestamp=new Date();
	
	var url = post.post_url;
	var date = post.date;
	var last_track = timestamp;
	var last_count = post.note_count;
	
	if(post.type == 'photo') {
		var image = post.image_permalink;
		connection.query('INSERT INTO post (url, date, image, last_track, last_count) \
		VALUES (?, ?)', [url, date, image, last_track, last_count]);
	}
	else if(post.type == 'text') {
		var text = post.body;
		connection.query('INSERT INTO post (url, date, text, last_track, last_count) \
		VALUES (?, ?)', [url, date, text, last_track, last_count]);
	}
	
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