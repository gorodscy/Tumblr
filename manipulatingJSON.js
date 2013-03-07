/* Manipulating a post: */
// Creating a post object:
var post = new Object();
post.content = "Post's content";
post.date = "1/1/2013";
post.note_count = "400";

// Writing a post in a file:
var string = JSON.stringify(post);
var fs = require('fs');
fs.writeFile('post.txt', string, function (err) {
  if (err) throw err; {
  	console.log('Post succesfully saved!');
  }
});

// Reading a post from a file:
fs.readFile('post.txt', function (err, data) {
  if (err) throw err; {
  	var post = JSON.parse(data); 
  	console.log(post.content);
  }
});

/***************************************************************/

/* Manipulating many posts: */
var posts = [
	{"content": "Post's content 1", "url": "http://blog1.tumblr.com", "date" : "1/1/2013", "note_count" : "100"},	// posts[0]
	{"content": "Post's content 2", "url": "http://blog2.tumblr.com", "date" : "2/1/2013", "note_count" : "200"},	// posts[1]
	{"content": "Post's content 3", "url": "http://blog3.tumblr.com", "date" : "3/1/2013", "note_count" : "300"},	// posts[2]
	{"authors": ["Name 1", "Name 2"]}
];

// Writing many posts in a file:
var string = JSON.stringify(posts);
var fs = require('fs');
fs.writeFile('posts.txt', string, function (err) {
  if (err) throw err; {
  	console.log('All posts were saved!');
  }
});

// Reading posts from a file:
fs.readFile('posts.txt', function (err, data) {
	if (err) throw err; {
		var post = JSON.parse(data); 
		console.log(posts[0]);// Getting the whole first post
		console.log(posts[0].content); // Only first post's content field
		console.log(posts[1].url); // Only first post's URL field
		console.log(posts[1].date); // Only second post's date field
		console.log(posts[2].note_count); // Only third post's note_count field
		console.log(posts[3].authors); // Authors' names - another example of data being saved
	}
});