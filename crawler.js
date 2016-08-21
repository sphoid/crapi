// var async = require('async');
var Crawler = function( crapi, cdb ){
	this.crapi = crapi;
	this.cdb = cdb;
}

ProcessException = function( message ){
	this.message = message;
}

ProcessException.prototype.getMessage = function(){
	return this.message;
}

Crawler.prototype.processStrain = function( strain, callback ){

	this.cdb.insert(strain, function(error, body){
		if ( error ){
			callback(error);
		} else {
			console.log("Inserted strain: " + strain.name);
			callback(null);
		}
	});

}

Crawler.prototype.processStrains = function( strains, callback ){

	try {

		strains.forEach(function( strain ){

			this.processStrain(strain, function(error){
				if ( error ){
					throw new ProcessException(error);
				}
			});

		}.bind(this));

	} catch ( x ){

		callback("Error: ", x.getMessage());

	}

	callback(null);

}

Crawler.prototype.getStrains = function( page, callback ){

	console.log("Getting strains page=" + page);

	this.crapi.getStrains({page: page, sort: 'name'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processStrains(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllStrains = function(){

	console.log("Collecting strains data");

	var recursiveCallback = function( error, response ){

		var total_pages, current_page, next;

		if ( error ){
			console.log("Error occured: ", error);
			return;
		}

		if ( response.meta && response.meta.pagination ){

			console.log("Response meta: ", response.meta);

			total_pages = response.meta.pagination.total_pages;
			current_page = response.meta.pagination.current_page;
		}

		if ( current_page < total_pages ){

			next_page = current_page + 1;

			setTimeout(function(){
				this.getStrains(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getStrains(1, recursiveCallback);

}

module.exports = Crawler;
