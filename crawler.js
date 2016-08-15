var async = require('async');
var Crawler = function( crapi, cdb ){
	this.crapi = crapi;
	this.cdb = cdb;
}

Crawler.prototype.processStrains = function( strains ){

	strains.forEach(function( strain ){
		// console.log("Parsing strain:", strain);

		this.cdb.insert(strain, function(error, body){
			if ( error ){
				console.log("Error: ", error);
			} else {
				console.log("Inserted strain: ", strain);
			}
		});
	}.bind(this));

}

Crawler.prototype.getStrains = function( page ){

};

Crawler.prototype.getAllStrains = function(){

	console.log("Collecting strains data");

	var request = this.crapi.getStrains(null, function( response ){

		var total_pages, current_page, next;

		if ( response.meta && response.meta.pagination ){
			total_pages = response.meta.pagination.total_pages;
			current_page = response.meta.pagination.current_page;
			next = response.meta.pagination.links.next;
		} else {
			console.log("Something went wrong. Could not parse pagination meta");
			return;
		}

		if ( response.data ){
			this.processStrains(response.data);
		} else {
			console.log("Something went wrong. Could not parse data");
		}

		if ( current_page < total_pages ){

			var pages = Array.apply(null, Array(total_pages)).map(function (_, i) {return i;});

			console.log(pages);

			// console.log("Next endpoint: " + next);
		} else {
			console.log("Finished");
		}

	}.bind(this));

}

module.exports = Crawler;
