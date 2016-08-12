var CRAPI = require('./crapi.js');
var Crawler = require('./crawler.js');

var crapi = new CRAPI();
var crawler = new Crawler(crapi);

crawler.getStrains();

//crapi.getStrains(null, function(data){

//	console.log(data);
	
//});
