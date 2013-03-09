db = require('mysql');

// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePost = writePost;
module.exports.saveBlog = saveBlog;
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
	'`date` date NOT NULL,'+
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
	
	connection.query('INSERT INTO blog (hostname, liked_count) VALUES (?, ?)', [hostname, liked_count]);
	
	for(var i=0; i<liked_count; i++) {
		writePost(liked_posts[i], hostname);
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
		VALUES (?, ?, ?, ?, ?, ?)', [url, date, image, last_track, last_count, hostname_blog]);
	}
	else if(post.type == 'text') {
		var text = post.body;
		connection.query('INSERT INTO post (url, date, text, last_track, last_count, hostname_blog) \
		VALUES (?, ?, ?, ?, ?, ?)', [url, date, text, last_track, last_count,  hostname_blog]);
	}
	connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
		VALUES (?, ?, ?, ?, ?)', [timestamp.toString(), 1, 0, post.note_count, url]);
	
	//trackPost(post, url);
}

// Generate a new Track for post
function trackPost(post, url_post){
	//get Timestamp
	var timestamp=new Date();
	
	var last_track = getLastTrack(post, url_post)
	
// 	var sequence = last_track.sequence + 1;
// 	var increment = post.note_count - last_track.count;
// 	var count = post.note_count;
// 	var id_post = last_track.id_post;
// 	
// 	connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
// 	VALUES (?, ?, ?, ?, ?)', [timestamp, sequence, increment, count, url_post]);
	
}

// Get last track from post
function getLastTrack(post, url_post){
	
	var track;
	var post_id;
	
	
	connection.query('SELECT * FROM track WHERE url_post = (?)', [url_post], function (err, rows) {
		if (err) throw err;
		console.log("dentro:", rows[0]);
	});
	
	
}


























