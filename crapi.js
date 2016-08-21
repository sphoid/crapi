var Client = require('node-rest-client').Client;

var CRAPI = function( apikey ){
	this.apikey = apikey;
	this.client = new Client();
	this.rateLimits = {
		total: 0,
		remaining: 0,
		reset: null
	};
}

CRAPI.prototype.api = function( endpoint, args, callback ){

	var url = 'https://www.cannabisreports.com/api/v1.0' + endpoint;

	if ( ! args.hasOwnProperty('headers') ){
		args.headers = {};
	}

	if ( this.apikey ){
		args.headers['X-API-KEY'] = this.apikey;
	}

	console.log("API url=" + url + " args=", args);

	return this.client.get(url, args, function( data, response ){
		var headers = response.headers;
		this.rateLimits.total = headers['x-ratelimit-limit'];
		this.rateLimits.remaining = headers['x-ratelimit-remaining'];
		this.rateLimits.reset = parseInt(headers['x-ratelimit-reset']);
		var now = Math.floor(Date.now() / 1000);
		// console.log(this.rateLimits);
		console.log("Rate Limit "+this.rateLimits.remaining+"/"+this.rateLimits.total+" resets in " + (this.rateLimits.reset - now) + " seconds")
		callback(null, data);
	}.bind(this))
	.on('error', function(error) {
		callback(error, null);
	});

}

CRAPI.prototype.appendParam = function( url, key, value ){

	url += (url.split('?')[1] ? '&':'?') + key + '=' + value;

	return url;

}

CRAPI.prototype.parseParams = function( endpoint, args, supportedParams ){

	var params = {};

	if ( args && supportedParams ){

		supportedParams.forEach(function(key){

			if ( args.hasOwnProperty(key) ){

				endpoint = this.appendParam(endpoint, key, args[key]);
				params[key] = args[key];

			}

		}.bind(this));

	}

	console.log("Final endpoint ", endpoint);

	return {
		endpoint: endpoint,
		parameters: params
	};

}

CRAPI.prototype.getStrains = function( args, callback ){

	var req = this.parseParams('/strains', args, ['page','sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.searchStrains = function( query, args, callback ){

	var req = this.parseParams('/strains/search/${query}', args, ['page']);
	var path = {
		'query': query
	};

	return this.api(
		req.endpoint,
		{
			path: path,
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getStrainByUCPC = function( ucpc, args, callback ){

	var endpoint = '/strains/${ucpc}';
	var path = {
		'ucpc': ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getStrainAvailabilityByGeo = function( ucpc, latitude, longitude, radius, args, callback ){

	var req = this.parseParams('/strains/${ucpc}/availability/geo/${latitude}/${longitude}/${radius}', args, ['page']);
	var path = {
		'ucpc': ucpc,
		'latitude': latitude,
		'longitude': longitude,
		'radius': radius
	};

	return this.api(
		req.endpoint,
		{
			path: path,
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getFlowers = function( args, callback ){

	var req = this.parseParams('/flowers', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getFlowersByType = function( flowerType, args, callback ){

	var req = this.parseParams('/flowers/type/${flowerType}', args, ['page', 'sort']);
	var path = {
		'flowerType': flowerType
	};

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getFlowerByUCPC = function( ucpc, args, callback ){

	var endpoint = '/flowers/${ucpc}';
	var path = {
		'ucpc': ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getExtracts = function( args, callback ){

	var req = this.parseParams('/extracts', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);
}

CRAPI.prototype.getExtractsByType = function( extractType, args, callback ){

	var req = this.parseParams('/extracts/type/${extractType}', args, ['page', 'sort']);
	var path = {                                                                                                                                              'extractType': extractType                                                                                                                };

	return this.api(
		req.endpoint,
		{
			path: path,
			parameters: req.parameters
		},
		callback
	);
}

CRAPI.prototype.getExtractByUCPC = function( ucpc, args, callback ){

	var endpoint = '/extracts/${ucpc}';
	var path = {
		'ucpc':ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);
}

CRAPI.prototype.getEdibles = function( args, callback ){

	var req = this.parseParams('/edibles', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getEdiblesByType = function( edibleType, args, callback ){

	var req = this.parseParams('/edibles/type/${edibleType}', args, ['page', 'sort']);
	var path = {
		'edibleType': edibleType
	};


	return this.api(
		req.endpoint,
		{
			path: path,
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getEdibleByUCPC = function( ucpc, args, callback ){

	var endpoint = '/edibles/${ucpc}';
	var path = {
		'ucpc': ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getProducts = function( args, callback ){

	var req = this.parseParams('/products', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getProductsByType = function( productType, args, callback ){

	var req = this.parseParams('/products/type/${productType}', args, ['page', 'sort']);
	var path = {
		'productType': productType
	};

	return this.api(
		req.endpoint,
		{
			path: path,
			parameters: req.parameters
		},
		callback
	);
}

CRAPI.prototype.getProductByUCPC = function( ucpc, args, callback ){

	var endpoint = '/products/${ucpc}';
	var path = {
		'ucpc': ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getProducers = function( args, callback ){

	var req = this.parseParames('/producers', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getProducerByUCPC = function( ucpc, args, callback ){

	var endpoint = '/producers/${ucpc}';
	var path = {
		'ucpc':ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getDispensaries = function( args, callback ){

	var req = this.parseParams('/dispensaries', args, ['page', 'sort']);

	return this.api(
		req.endpoint,
		{
			parameters: req.parameters
		},
		callback
	);

}

CRAPI.prototype.getDispensary = function( state, city, slug, args, callback ){

	var endpoint = '/dispensaries/${state}/${city}/${slug}';
	var path = {
		'state': state,
		'city': city,
		'slug': slug
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

CRAPI.prototype.getSeedCompanyByUCPC = function( ucpc, args, callback ){

	var endpoint = '/seed-companies/${ucpc}';
	var path = {
		'ucpc': ucpc
	};

	return this.api(
		endpoint,
		{
			path: path
		},
		callback
	);

}

module.exports = CRAPI;
