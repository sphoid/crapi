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

function reindex( model ){

	console.log("Reindexing");

	var nano = require('nano')({
		'url': 'http://' + cdbConfig.host + ':' + cdbConfig.port
	});

	var crapi = new CRAPI(crConfig.apikey);
	var crawler = new Crawler(crapi, nano.use(DB_NAME));

	// crapi.getStrains(null, function(data){
	// 	console.log("Done");
	// });

	if ( 'strains' == model ){
		crawler.getAllStrains();
	} else if ( 'flowers' == model ){
		crawler.getAllFlowers();
	} else if ( 'extracts' == model ){
		crawler.getAllExtracts();
	} else if ( 'edibles' == model ){
		crawler.getAllEdibles();
	} else if ( 'products' == model ){
		crawler.getAllProducts();
	} else if ( 'producers' == model ){
		crawler.getAllProducers();
	} else if ( 'dispensaries' == model ){
		crawler.getAllDispensaries();
	} else {
		console.log("Unrecognized or missing model");
	}
}

if ( argv._.length > 0 ){

	var command = argv._[0];

	if ( 'install' == command ){
		authenticate( install, function(){ process.exit(); });

	} else if ( 'reinstall' == command ){
		authenticate( reinstall, function(){ process.exit(); } );

	} else if ( 'reindex' == command ){

		var model;

		if ( argv._[1]){
			model = argv._[1];
		}

		reindex(model);
	}

}