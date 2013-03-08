var tracker = require('./tracker.js');

// Lauch the tracker as soon as the server begin
tracker.trackBlog('https://api.tumblr.com/v2/blog/gorodscy.tumblr.com/likes?\
api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp');

// Making a function be executed every hour:
var interval = 3600000; // 1 hour in milliseconds

var runningFunction = setInterval(everyhourFunction, interval);

function everyhourFunction() {
  // Code to be executed:
  tracker.trackBlog('https://api.tumblr.com/v2/blog/gorodscy.tumblr.com/likes?\
api_key=ZtJYLO0HI9tPYsC2pqCy6ciItK3XxWL9KgQErmo2TsknKtNtEp');
}

// [If necessary] Removing the running condition:
//clearInterval(interval);