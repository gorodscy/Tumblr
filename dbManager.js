db = require('mysql');
tracker = require('./tracker.js');

// Export the functions to be used in other files.
// OBS: Other files should evoke require('./fileManager.js'); (if in the same dir)
module.exports.writePost = writePost;
module.exports.saveBlog = saveBlog;
module.exports.createDB = createDB;
module.exports.updateAll = updateAll;
module.exports.updateBlog = updateBlog;
module.exports.getBlog = getBlog;
module.exports.getAllBlogs = getAllBlogs
module.exports.getAllPosts = getAllPosts
module.exports.getAllTracks = getAllTracks
module.exports.getLastTrack = getLastTrack
module.exports.getPreviousTrack = getPreviousTrack
module.exports.getPostbyPopularity = getPostbyPopularity;
module.exports.getPostRecent = getPostRecent;
module.exports.getBlogPostRecent = getBlogPostRecent;
module.exports.getBlogPostbyPopularity = getBlogPostbyPopularity;

// Set up the connection
var connection = db.createConnection({
	host: 'csc309.db.9068705.hostedresource.com',
	user: 'csc309',
	password: 'C@nada2013'
// 	host: 'localhost',
// 	port: 8889,
// 	database: "tumblr",
// 	user: 'gorodscy',
// 	password: '123'
// 	host: 'localhost',
// 	user: 'c3curygo',
// 	password: 'c89de916'
});



function createDB(creation_end) {
	// Establish the connection
	connection.connect();

	connection.query('SET SESSION wait_timeout = 1000000000');

// 	connection.query('DROP DATABASE IF EXISTS csc309');
	connection.query('CREATE DATABASE IF NOT EXISTS csc309'); // Creating a database
	connection.query('USE csc309');
// 	connection.query('DROP DATABASE IF EXISTS tumblr');
// 	connection.query('CREATE DATABASE IF NOT EXISTS tumblr'); // Creating a database
// 	connection.query('USE tumblr');
// 	connection.query('DROP DATABASE IF EXISTS csc309h_c3curygo');
// 	connection.query('CREATE DATABASE IF NOT EXISTS csc309h_c3curygo'); // Creating a database
// 	connection.query('USE csc309h_c3curygo');
	// Creating blog table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `blog` ('+
	'`hostname` varchar(250) NOT NULL,'+
	'`liked_count` int(11),'+
	'PRIMARY KEY (`hostname`)'+
	') ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
	// Creating post table in the database tumblr
	connection.query('CREATE TABLE IF NOT EXISTS `post` (' +
	'`url` varchar(250) NOT NULL,'+
	'`date` varchar(250) NOT NULL,'+
	'`image` text,'+
	'`text` text,'+
	'`last_track` varchar(50) NOT NULL,'+
	'`last_count` int(11) NOT NULL,'+
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
	
	connection.on('end', creation_end);
}

// Write blog on DB
function saveBlog(hostname, liked_count, liked_posts){
	
	// Test if hostname already exists in DB
	connection.query('SELECT * FROM blog WHERE hostname = "' + hostname + '"', function(err, rows){
		if(err) throw err;
		
		if(rows[0] == undefined){
			connection.query('INSERT INTO blog (hostname, liked_count) VALUES (?, ?)', [hostname, liked_count]);
	
			// For each liked post (maximum 20)
			for(var i=0; i<liked_count && i<20; i++) {
				writePost(liked_posts[i], hostname);
			}
		}
	});
}

// Update DB
function updateAll (){
	
	// Select all blogs being tracked
	connection.query('SELECT * FROM blog', function (err, rows) {
		if(err) throw err;
		
		// For each blog found
		for(var i=0; rows[i] != undefined; i++){
		
			tracker.reTrackBlog(rows[i].hostname);
			
		}
		
	});
	
}

// Update a single existing blog
function updateBlog(hostname, liked_count, liked_posts){
	
	connection.query('UPDATE blog SET liked_count = ' + liked_count + ' WHERE hostname = "' + hostname + '"');
	
	// For each liked post (maximum 20)
	for(var i=0; i<liked_count && i<20; i++) {
		updatePost(liked_posts[i], hostname);
	}
	
}

// Writing post in DB:
function writePost(post, hostname_blog){
	//get Timestamp
	var timestamp=displayTime();
	
	var url = post.post_url;
	var date = post.date;
	var last_track = timestamp;
	var last_count = post.note_count;
	
	
	if(post.type == 'photo') {
		var image = post.image_permalink;
		connection.query('INSERT INTO post (url, date, image, last_track, last_count, hostname_blog) \
		VALUES (?, ?, ?, ?, ?, ?)', [url, date.toString(), image, last_track, last_count, hostname_blog]);
	}
	else {
		var text = post.body;
		connection.query('INSERT INTO post (url, date, text, last_track, last_count, hostname_blog) \
		VALUES (?, ?, ?, ?, ?, ?)', [url, date.toString(), text, last_track, last_count, hostname_blog]);
	}
	
	// Write the first track
	connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
		VALUES (?, ?, ?, ?, ?)', [timestamp, 1, 0, post.note_count, url]);
		
}


// Update post in DB:
function updatePost(post, hostname_blog){
	//get Timestamp
	var timestamp=displayTime();
	
	// Check if exists
	
	// If no: redirect to writePost and return here;
	
	// IF yes:
	
	var url = post.post_url;
	var last_track = timestamp;
	var last_count = post.note_count;
	
	connection.query('UPDATE post SET last_track = "' + last_track +  '", last_count = ' 
						+ last_count + ' WHERE url = "' + url + '"');
					
	
	getLastTrack(post, function(last_track){
		
		var sequence = last_track.sequence + 1;
		var increment = post.note_count - last_track.count;
		
		// Write track
		connection.query('INSERT INTO track (timestamp, sequence, increment, count, url_post) \
		VALUES (?, ?, ?, ?, ?)', [timestamp, sequence, increment, post.note_count, url]);
		
	});
}

// Retrieve last track of a given post
// HOW TO USE this function:
//
// db.getAllPosts(hostname, function(posts){
// 		console.log(posts[0]);
// 		
// 		db.getLastTrack(posts[0], function(track){
// 			
// 			console.log(track);
// 			
// 		});
// 		
// 	});
///
function getLastTrack(post, cb){
	
	connection.query('SELECT * FROM track WHERE url_post = (?) ORDER BY sequence DESC', 
						[post.post_url], function(err, rows){
		if(err) throw err;
		
		if(rows[0] != undefined) {
			cb(rows[0]);
		}
		
	});
	
}

// Retrieve previous track of a given post
// HOW TO USE this function:
//
// db.getAllPosts(hostname, function(posts){
// 		console.log(posts[0]);
// 		
// 		db.getPreviousTrack(posts[0], function(track){
// 			
// 			console.log(track);
// 			
// 		});
// 		
// 	});
///
function getPreviousTrack(post, cb){
	
	connection.query('SELECT * FROM track WHERE url_post = (?) ORDER BY sequence DESC', [post.url], function(err, rows){
		if(err) throw err;
		
		if(rows[1] != undefined)
			cb(rows[0]);
		
	});
	
}

// Retrieve a list of all tracks given a post
// HOW TO USE this function:
//
// db.getAllPosts(hostname, function(posts){
// 		console.log(posts[0]);
// 		
// 		db.getAllTracks(posts[0], function(tracks){
// 			
// 			console.log(tracks);
// 			
// 		});
// 		
// 	});
///
function getAllTracks(post, cb){
	
	connection.query('SELECT track.timestamp, track.sequence, track.increment, track.count\
						 FROM track WHERE url_post = (?)', [post.url], function(err, rows){
		if(err) throw err;
		
		if(rows != undefined) {
			cb(rows, post);
		}
		
	});
	
}

// Retrieve a list of all posts given a blog
// HOW TO USE this function:
//
// db.getAllPosts(hostname, function(posts){
// 		console.log(posts);
// 	});
///
function getAllPosts(hostname, cb){
	
	connection.query('SELECT * FROM post WHERE hostname_blog = (?)', [hostname], function(err, rows){
		if(err) throw err;
		
		if(rows != undefined)
			cb(rows);
		
	});
	
}

/// Retrieve a blog given its hostname:
// HOW TO USE this function:
//		
//	db.getBlog(hostname, function(blog){
//		console.log(blog);
//	});
///
function getBlog(hostname, cb){
	
	connection.query('SELECT * FROM blog WHERE (hostname) = (?)', [hostname], function(err, rows){
		if(err) throw err;
		
		if(rows[0] != undefined)
			cb(rows[0]);
		
	});
	
}

/// Retrieve a list of all blogs
// HOW TO USE this function:
//
// db.getAllBlogs(function(blogs){
// 		console.log(blogs);
// 	});
///
function getAllBlogs(cb){
	
	connection.query('SELECT * FROM blog', function(err, rows){
		if(err) throw err;
		
		if(rows != undefined)
			cb(rows);
		
	});
	
}

function getPostbyPopularity(limit, cb){
	
	// Retrieve All posts ordered by popularity
	var query = 'SELECT post.url, post.text, post.image, post.date, post.last_track, post.last_count\
	FROM post\
	INNER JOIN track\
	ON post.url = track.url_post\
	WHERE track.sequence = (SELECT MAX(sequence) FROM track WHERE track.url_post = post.url)\
	ORDER BY track.increment DESC LIMIT 0, ' + limit;

	
	connection.query(query, function(err, rows){
		if(err) throw err;
		
		if(rows != undefined) {
			
			// For each post
			for(var i=0; rows[i] != undefined && i<limit; i++){
				
				getAllTracks(rows[i], function(tracks, post){
					
					post.tracking = tracks;
					
					cb(post, rows.length);
				});
				
				
			}
		}
	});
	
}

function getPostRecent(limit, cb){
	
	// Retrieve All posts ordered by popularity
	var query = 'SELECT post.url, post.text, post.image, post.date, post.last_track, post.last_count \
				FROM post \
				INNER JOIN track ON post.url = track.url_post \
				WHERE track.sequence = ( \
				SELECT MIN( sequence ) \
				FROM track \
				WHERE track.url_post = post.url ) \
				ORDER BY post.date DESC LIMIT 0, ' + limit;

	
	connection.query(query, function(err, rows){
		if(err) throw err;
		
		if(rows != undefined) {
			
			// For each post
			for(var i=0; rows[i] != undefined && i<limit; i++){
				
				getAllTracks(rows[i], function(tracks, post){
					
					post.tracking = tracks;
					
					cb(post, rows.length);
				});
				
				
			}
		}
	});
	
}

function getBlogPostRecent(hostname, limit, cb){
	
	// Retrieve All posts ordered by popularity
	var query = 'SELECT post.url, post.text, post.image, post.date, post.last_track, post.last_count \
				FROM post \
				INNER JOIN track \
				ON (post.url = track.url_post AND post.hostname_blog = "' + hostname + '") \
				WHERE track.sequence = ( \
				SELECT MIN( sequence ) \
				FROM track \
				WHERE track.url_post = post.url ) \
				ORDER BY post.date DESC LIMIT 0, ' + limit;

	
	connection.query(query, function(err, rows){
		if(err) throw err;
		
		// If has any results
		if(rows[0] != undefined) {
			// For each post
			for(var i=0; rows[i] != undefined; i++){
				
				getAllTracks(rows[i], function(tracks, post){
					
					post.tracking = tracks;
					
					cb(post, rows.length);
				});
				
				
			}
		}
		// If not find
		else {
			cb(404, 1);
		}
	});
	
}

function getBlogPostbyPopularity(hostname, limit, cb){
	
	// Retrieve All posts ordered by popularity
	var query = 'SELECT post.url, post.text, post.image, post.date, post.last_track, post.last_count \
	FROM post \
	INNER JOIN track \
	ON (post.url = track.url_post AND post.hostname_blog = "' + hostname + '") \
	WHERE track.sequence = (SELECT MAX(sequence) FROM track WHERE track.url_post = post.url) \
	ORDER BY track.increment DESC LIMIT 0, ' + limit;

	
	connection.query(query, function(err, rows){
		if(err) throw err;
		
		// If has any results
		if(rows[0] != undefined) {
			
			// For each post
			for(var i=0; rows[i] != undefined && i<limit; i++){
				
				getAllTracks(rows[i], function(tracks, post){
					
					post.tracking = tracks;
					
					cb(post, rows.length);
				});
				
				
			}
		}
		// If not find
		else {
			cb(404, 1);
		}
	});
	
}


function displayTime() {
	var str = "";
	var currentTime = new Date();

	var year = currentTime.getFullYear();
	var month = (currentTime.getMonth() + 1);
	var day = currentTime.getDate();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}

	if (day < 10) {
		day = "0" + day;
	}

	if (minutes < 10) {
		minutes = "0" + minutes
	}

	if (seconds < 10) {
		seconds = "0" + seconds
	}

	str += year + "-" + month + "-" + day + ' ' + hours + ":" + minutes + ":" + seconds + " ";

	if(hours > 11){
		str += "PM"
	} else {
		str += "AM"
	}

	return str;
}