// var async = require('async');
var Crawler = function( crapi, cdb ){
	this.crapi = crapi;
	this.cdb = cdb;
}

// var ProcessException = function( message ){
// 	this.message = message;
// }

// ProcessException.prototype.getMessage = function(){
// 	return this.message;
// }

Crawler.prototype.processItem = function( item, callback ){

	this.cdb.insert(item, function(error, body){
		if ( error ){
			callback(error);
		} else {
			console.log("Inserted item: " + item.name);
			callback(null);
		}
	});

}

Crawler.prototype.processItems = function( items, callback ){

	try {

		items.forEach(function( item ){

			this.processItem(item, function(error){
				if ( error ){
					throw {
						name: 'Process Exception',
						message: error
					};
					// throw new ProcessException(error);
				}
			});

		}.bind(this));

	} catch ( x ){

		callback("Error: ", x.message);

	}

	callback(null);

}


Crawler.prototype.getStrains = function( page, callback ){

	console.log("Getting strains page=" + page);

	this.crapi.getStrains({page: page, sort: 'name'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
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


Crawler.prototype.getFlowers = function( page, callback ){

	console.log("Getting flowers page=" + page);

	this.crapi.getFlowers({page: page, sort: 'createdAt'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllFlowers = function(){

	console.log("Collecting flowers data");

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
				this.getFlowers(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getFlowers(1, recursiveCallback);

}



Crawler.prototype.getExtracts = function( page, callback ){

	console.log("Getting extracts page=" + page);

	this.crapi.getExtracts({page: page, sort: 'createdAt'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllExtracts = function(){

	console.log("Collecting extracts data");

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
				this.getExtracts(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getExtracts(1, recursiveCallback);

}


Crawler.prototype.getEdibles = function( page, callback ){

	console.log("Getting edibles page=" + page);

	this.crapi.getEdibles({page: page, sort: 'createdAt'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllEdibles = function(){

	console.log("Collecting edibles data");

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
				this.getEdibles(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getEdibles(1, recursiveCallback);

}


Crawler.prototype.getProducts = function( page, callback ){

	console.log("Getting products page=" + page);

	this.crapi.getProducts({page: page, sort: 'createdAt'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllProducts = function(){

	console.log("Collecting products data");

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
				this.getProducts(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getProducts(1, recursiveCallback);

}


Crawler.prototype.getProducers = function( page, callback ){

	console.log("Getting producers page=" + page);

	this.crapi.getProducers({page: page, sort: 'name'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllProducers = function(){

	console.log("Collecting producers data");

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
				this.getProducers(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getProducers(1, recursiveCallback);

}


Crawler.prototype.getDispensaries = function( page, callback ){

	console.log("Getting dispensaries page=" + page);

	this.crapi.getDispensaries({page: page, sort: 'name'}, function( error, response ){

		if ( error ){
			callback(error);
		} else {

			this.processItems(response.data, function(error){
				callback(error, response);
			});

		}

	}.bind(this));

};

Crawler.prototype.getAllDispensaries = function(){

	console.log("Collecting dispensaries data");

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
				this.getDispensaries(next_page, recursiveCallback);
			}.bind(this), 10000);

		}

	}.bind(this);

	this.getDispensaries(1, recursiveCallback);

}


module.exports = Crawler;
