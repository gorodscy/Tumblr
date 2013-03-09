tracker = require('./tracker.js');
file = require('./fileManager.js');
trend = require('./trendManager.js');
express = require('express');
db = require('mongodb');

var port = 31010;

// Lauch the tracker as soon as the server begin
everyhourFunction();

// Making a function be executed every hour:
var interval = 3600000; // 1 hour in milliseconds

// Create an express application
var app = express();

// Configuring the app
app.configure(function () {
	app.use(express.bodyParser());
});

/// Define the REST API:
// Define POST:
app.post('/blog', tracker.postBlog);
// Define GET:
app.get('/blog/:hostname/trends', trend.trendBlog);
app.get('/blog/trends', trend.trendAll);

app.listen(port);

var runningFunction = setInterval(everyhourFunction, interval);

function everyhourFunction() {
	// Code to be executed:
	
	// Read the blog list ("blogs.txt");
	// Track (each hour) all tracks on the list: tracker.trackBlogs();
	// Store all the obtained data in the DB
}

// [If necessary] Removing the running condition:
//clearInterval(interval);