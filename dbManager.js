db = require('mysql');
tracker = require('./tracker.js');

// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePost = writePost;
module.exports.saveBlog = saveBlog;
module.exports.createDB = createDB;
module.exports.updateAll = updateAll;

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

	connection.query('DROP DATABASE IF EXISTS tumblr');
	connection.query('CREATE DATABASE IF NOT EXISTS tumblr'); // Creating a database
	connection.query('USE tumblr');
	// Creating blog table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `blog` ('+
	'`hostname` varchar(250) NOT NULL,'+
	'`liked_count` int(11) NOT NULL,'+
	'PRIMARY KEY (`hostname`)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	// Creating post table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `post` (' +
	'`url` varchar(250) NOT NULL,'+
	'`date` varchar(250) NOT NULL,'+
	'`image` text,'+
	'`text` text,'+
	'`last_track` text NOT NULL,'+
	'`last_count` text NOT NULL,'+
	'`hostname_blog` varchar(250) NOT NULL,'+
	'PRIMARY KEY (`url`),'+ 
	'FOREIGN KEY (`hostname_blog`) REFERENCES `blog` (`hostname`)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	// Creating track table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `track` ('+
	'`id` int(11) NOT NULL AUTO_INCREMENT,'+
	'`timestamp` text NOT NULL,'+
	'`sequence` int(11) NOT NULL,'+
	'`increment` int(11) NOT NULL,'+
	'`count` int(11) NOT NULL,'+
	'`url_post` varchar(250) NOT NULL,'+
	'PRIMARY KEY (`id`),'+
	'FOREIGN KEY (`url_post`) REFERENCES `post` (`url`)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	

}

function closeDB(){
	// Finish the connection
	connection.end();
}

// Write blog on DB
function saveBlog(hostname, liked_count, liked_posts){
	
	// Test if hostname already exists in DB
	// If not:
	
	connection.query('INSERT INTO blog (hostname, liked_count) VALUES (?, ?)', [hostname, liked_count]);
	
	// For each liked post (maximum 20)
	for(var i=0; i<liked_count && i<20; i++) {
		writePost(liked_posts[i], hostname);
	}
	
}

// Update DB
function updateAll (){
	
	// Select all blogs being tracked
	connection.query('SELECT * FROM blog', function (err, rows) {
		
		// For each blog found
		for(var i=0; i<rows.size(); i++){
			
			tracker.reTrackBlog(rows[i].hostname);
			
		}
		
	});
	
}

// Update a single existing blog
function updateBlog(hostname, liked_count, liked_posts){
	
	connection.query('UPDATE blog SET (liked_count) = (?) WHERE hostname = (?)',
						[liked_count, hostname]);
	
	// For each liked post (maximum 20)
	for(var i=0; i<liked_count && i<20; i++) {
		updatePost(liked_posts[i], hostname);
	}
	
}

// Writing post in DB:
function writePost(post, hostname_blog){
	//get Timestamp
	var timestamp=new Date();
	
	var url = post.post_url;
	var date = post.date;
	var last_track = timestamp;
	var last_count = post.note_count;
	
	if(post.type == 'photo') {
		var image = post.image_permalink;
		connection.query('INSERT INTO post (url, date, image, last_track, last_count, hostname_blog) \
		VALUES (?, ?, ?, ?, ?, ?)', [url, date.toString(), image, last_track, last_count, hostname_blog]);
	}
	else if(post.type == 'text') {
		var text = post.body;
		connection.query('INSERT INTO post (url, date, text, last_track, last_count, hostname_blog) \
		VALUES (?, ?, ?, ?, ?, ?)', [url, date.toString(), text, last_track, last_count,  hostname_blog]);
	}
	// Write the first track
	connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
		VALUES (?, ?, ?, ?, ?)', [timestamp.toString(), 1, 0, post.note_count, url]);
}


// Update post in DB:
function updatePost(post, hostname_blog){
	//get Timestamp
	var timestamp=new Date();
	
	// Check if exists
	
	// If no: redirect to writePost and return here;
	
	// IF yes:
	
	var url = post.post_url;
	var last_track = timestamp;
	var last_count = post.note_count;
	
	connection.query('UPDATE post SET (last_track, last_count) = (?,?) WHERE url = (?)', 
						[last_track, last_count, url]);
					
	// Needs to be calculated based on last track	
	var sequence;
	var increment;
	// Write track
	connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
		VALUES (?, ?, ?, ?, ?)', [timestamp.toString(), sequence, increment, post.note_count, url]);
}

// Retrieve last track of a given post
function getLastTrack(post){
	
	var track;
	
	return track;
	
}

// Retrieve a list of all tracks given a post
function getAllTracks(post){
	
	var tracks;
	
	// Some SELECT;
	// tracks = rows;
	
	return track;
	
}

// Retrieve a list of all posts given a blog
function getAllPosts(blog){
	
	var posts
	
	// Some SELECT;
	// posts = rows;
	
	return posts;
	
}

// Retrieve a blog given its hostname
function getBlog(hostname){
	
	
	
}

// Retrieve a list of all blogs
function getAllBlogs(){
	
	var blogs;
	
	// Some SELECT
	// blogs = rows;
	
	return rows;
	
}



















