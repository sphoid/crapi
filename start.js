const DB_NAME = 'herbtracker';

var Config = require('config');
var CRAPI = require('./crapi.js');
var Crawler = require('./crawler.js');

var cdbConfig = Config.get('couchdb');
var crConfig = Config.get('cannabisreports');
var argv = require('minimist')(process.argv.slice(2));

console.log("Arguments: ", argv);

function authenticate( successCallback, failCallback ){

	console.log("Authenticating");

	var nano = require('nano')({
		'url': 'http://' + cdbConfig.host + ':' + cdbConfig.port
	});

	nano.auth(cdbConfig.user, cdbConfig.password, function (error, body, headers) {

		if (error) {
			console.log("Authentication error: ", error);
			if ( failCallback ){
				failCallback();
			}
		}

		console.log("Authentication successful");

		nano = require('nano')({
			url: 'http://' + cdbConfig.host + ':' + cdbConfig.port,
			cookie: headers['set-cookie']
		});

		if ( successCallback ){
			successCallback(nano);
		}

	});

}

function install(nano){

	console.log("Creating database");

	nano.db.create(DB_NAME, function(error){
		console.log(error);;
		if ( error ){
			console.log("Error creating db: ", error);
			process.exit();
		}

		console.log("Created database");
	});

}

function reinstall(nano){

	console.log("Deleting database");

	nano.db.destroy(DB_NAME, function(error){
		if ( error ){
			console.log("Error deleting db: ", error);
			process.exit();
		}

		console.log("Deleted database");
		install(nano);
	});

}

function reindex(){

	console.log("Reindexing");

	var nano = require('nano')({
		'url': 'http://' + cdbConfig.host + ':' + cdbConfig.port
	});

	var crapi = new CRAPI(crConfig.apikey);
	var crawler = new Crawler(crapi, nano.use(DB_NAME));

	// crapi.getStrains(null, function(data){
	// 	console.log("Done");
	// });


	crawler.getAllStrains();
}

if ( argv._.length > 0 ){

	var command = argv._[0];

	if ( 'install' == command ){
		authenticate( install, function(){ process.exit(); });

	} else if ( 'reinstall' == command ){
		authenticate( reinstall, function(){ process.exit(); } );

	} else if ( 'reindex' == command ){
		reindex();
	}

}