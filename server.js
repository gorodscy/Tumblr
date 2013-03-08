var tracker = require('./tracker.js');
var file = require('./fileManager.js');

// Lauch the tracker as soon as the server begin
everyhourFunction();

// Making a function be executed every hour:
var interval = 3600000; // 1 hour in milliseconds

var runningFunction = setInterval(everyhourFunction, interval);

function everyhourFunction() {
	// Code to be executed:

	var blog_list;
	var count;

  	blog_list = file.saveBlog(blog_list, 'https://api.tumblr.com/v2/blog/gorodscy.tumblr.com/likes?\
api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp');
	blog_list = file.saveBlog(blog_list, 'https://api.tumblr.com/v2/blog/ystallonne.tumblr.com/likes?\
api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp');
  
 	 count = file.readBlogs(blog_list);
}

// [If necessary] Removing the running condition:
//clearInterval(interval);