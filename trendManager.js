// Linking to other files
db = require('./dbManager.js');

module.exports.trendBlog = trendBlog;
module.exports.trendAll = trendAll;

var allPosts = JSON.parse('{"trending":[]}');

function trendBlog (req, res){

}

var a = 0;

function trendAll (req, res){
	
	db.getPostbyPopularity(limit = 20, function(posts, i, end){
		
		//posts.order = 'Trending';
		//console.info("passou pelo trendAll");
		//console.info("o valor de i eh ",i);
		//console.info("o valor de end eh ",end);
		
		//we need to clean 'a' in order to overwrite the posts when we have a new GET request
		if (a >= end){
		console.info("a maior igual a end");
			a = 0;
		}
		
	//console.info("a menor que end");
	allPosts.trending[a++] = posts;
	//comtudo = allPosts;
	//console.info("letra a eh", a);
	
	
		//colocapost(posts, end);
		//allPosts.trending[i] = posts;
		
		
		//console.log('quem eh vc: ', posts);
		
		
		
		
		//I changed the below if condition from 'i' to 'a'because i is always equals to
		//end, whereas 'a' is not. In other words, we were sending the info to the client
		//lots of times (and we need just one time per GET)
		if(a == end){
		//order and limit just need to be updated once
		allPosts.order = "Trending";
		allPosts.limit = limit;
			console.info("enviando info para o cliente");		
		   //var temp = comtudo;
		   //comtudo = JSON.parse('{"trending":[]}');
		   //allPosts = JSON.parse('{"trending":[]}');
		   //a = 0;
		   
			//console.info('temp: ', temp);
			//console.info('comtudo ', comtudo);
			res.send(allPosts);
			}		
	});
	
	
	
}