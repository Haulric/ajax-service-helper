//Strict mode...
 "use strict";

/**
 * Build and send XMLHttpRequests.
 * @class
 * @parameter {String} baseUrl Base url used for each request.
 */
function Service(baseUrl){
    this.baseUrl = false;
    this.setBaseUrl(baseUrl);

    return this;
};

/*  services  */
/**
 * Set the baseUrl property.
 * @public
 */
Service.prototype.setBaseUrl = function(baseUrl){
    this.baseUrl = baseUrl.replace(/\/$/,'');
};

/**
 * Build a custom request, used if the user need to set manually some XMLHttpRequest propertys.
 * @public
 * @parameter {String} method The request method.
 * @parameter {String} request The request uri.
 * @parameter {Boolean} async Asynchronous mode.
 * @parameter {JSON} options Property collection that will be passed to XMLHttpRequest.
 * @parameter {Function} callback Called on success, for asynchronous request only
 * @parameter {Function} errorCallback Called on error, for asynchronous request only.
 * @return The XMLHttpRequest instance.
 */
Service.prototype.request = function(method, uri, async, parameters, options, callback, errorCallback){
    var req = this._buildRequest(method, uri, async);
    if(options) this._setRequestOptions(req, options);
    var parameters = (parameters) ? this._formatParameters(parameters) : null;
    this._sendRequest(req, parameters, callback, errorCallback);

    return req;
};

/**
 * Send GET request.
 * @public
 * @return The XMLHttpRequest object.
 */
Service.prototype.get = function(uri, async, callback, errorCallback){
    var req = this.request('GET',uri,async, false, false, callback, errorCallback);
    return req;
};

/**
 * Send POST request.
 * @public
 * @return The XMLHttpRequest object.
 */
Service.prototype.post = function(uri, async, parameters, callback, errorCallback){
    var req = this.request('POST', uri, async, parameters, false, callback, errorCallback);
    return req;
};

/**
 * Send PUT request.
 * @public
 * @return The XMLHttpRequest object.
 */
Service.prototype.put = function(uri, async, parameters,  callback, errorCallback){
    var req = this.request('PUT', uri, async, parameters, false, callback, errorCallback);
    return req;
};

/**
 * Send DELETE request.
 * @public
 * @return The XMLHttpRequest object.
 */
Service.prototype.del = function(uri, async, parameters,  callback, errorCallback){
    var req = this.request('DELETE', uri, async, parameters, false, callback, errorCallback);
    return req;
};

/**
 * Set the XMLHttpRequest object propertys.
 * @private
 * @parameter {Object} req The XMLHttpRequest instance
 * @parameter {JSON} options Properties collection.
 */
Service.prototype._setRequestOptions = function(req, options){
   if(typeof options === 'object'){
        for(var option in options){
	    if(typeof req[option] != 'undefined')
		req[option] = options[option];
        }
    }
}

/**
 * Build the XMLHttpRequest instance.
 * @private
 * @parameter {String} method The request method
 * @parameter {String} uri The request uri
 * @parameter {Boolean} async Asynchronous mode.
 * @return the XmlHttpRequest instance.
 */
Service.prototype._buildRequest = function(method,uri,async){
    var req = new XMLHttpRequest();
    var uri = uri.replace(this.baseUrl,'/');
    if(uri.charAt(0) !== '/') uri = '/'.concat(uri);

    req.open(method, this.baseUrl.concat(uri), async);
    return req;
};

/**
 * Format the parameters list so it can fit the content-type urlencoded
 * @private
 * @parameter {Mixed} parameters If a JSON object is given, it will be returned as an urlencoded string.
 * @return The urlencoded string
 */
Service.prototype._formatParameters = function(parameters){
    if(typeof parameters === 'string') return parameters;
    if(typeof parameters === 'object'){
        var formated = '';
        for(var param in parameters){
            if(formated.length) formated = formated.concat('&');
            formated = formated.concat(param,'=',parameters[param]);
        }
        return formated;
    }
    return null;
};

/**
 * Send tge reqyest and bind given callbacks
 * @private
 * @parameter {Object} request XMLHttpRequest instance
 * @parameter {String} parameters The urlencoded parameters string.
 * @parameter {Function} callback Called on success
 * @parameter {Function} errorCallback Called on error.
 */
Service.prototype._sendRequest = function(request, parameters, callback, errorCallback){
    if(callback || errorCallback){
	request.onreadystatechange = function(){
	    if(callback && request.readyState === 4 && request.status === 200){
		callback(request);
	    }
	    else if(errorCallback && request.readyState === 4 && request.status !== 200){
		errorCallback(request);
	    }
	}
    };

    if(parameters)
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(parameters);
};
