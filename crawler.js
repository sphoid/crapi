var Crawler = function( crapi ){
	this.crapi = crapi;
}

Crawler.prototype.processStrains = function( strains ){

	strains.forEach(function( strain ){
		console.log("Parsing strain:", strain);
	});

}

Crawler.prototype.getStrains = function(){

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
			console.log("Next endpoint: " + next);
		} else {
			console.log("Finished");
		}

	}.bind(this));

}

module.exports = Crawler;
