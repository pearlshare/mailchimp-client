var got = require("got");

function isPlainObj (x) {
	var prototype;
  var toString = Object.prototype.toString;
	return toString.call(x) === "[object Object]" && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
}


/*
 * Mailchimp client constructor
 * @param {Object} options
 *  @config {String} apiKey "xxxx"
 *  @config {String} host - "https://us8.api.mailchimp.com"
 *  @config {String} version - "2.0"
 *  @config {String} format - "json"
 *  @config {Object} logger - a logger function which acts like console.log
 */
var Mailchimp = function (options) {
  if (!options) {
    throw new Error("options object required");
  }
  if (!options.apiKey) {
    throw new Error("Mailchimp - no API key given. Please provide an object with a key of apiKey");
  }

  this.apiKey = options.apiKey;
  this.logger = (options.logger || function () {});
  this.host = this.host || "https://us8.api.mailchimp.com";
  this.version = this.version || "3.0";
  this.options = options;
};

/**
 * The function that makes requests to the API
 * @param {String} method - The HTTP method to use
 * @param {String} path - The path on the API to make the request to
 * @param {Object} opts - The request options such as headers, body and query
 * @returns {Promise} promise resolving to a boolean if the request was successful
 */
Mailchimp.prototype.makeRequest = function (method, path, opts) {
  var url = this.host + "/" + this.version + "/" + path;

  var reqOpts = {
    method: method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "apikey " + this.apiKey
    }
  };

  if (opts && opts.headers) {
    Object.assign(reqOpts.headers, opts.headers);
  }

  if (opts && [undefined, null].indexOf(opts.body) < 0 ) {
    if (isPlainObj(opts.body)) {
      reqOpts.body = JSON.stringify(opts.body);
    } else {
      reqOpts.body = opts.body;
    }
  }

  if (opts && opts.query) {
    reqOpts.query = opts.query;
  }

  return got(url, reqOpts)
    .then(function (res) {
      if (res.error) {
        throw res.error;
      } else {
        return JSON.parse(res.body);
      }
    });
};

/*
 * post a given data
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} opts - 'got' options such as body and query
 * @param {Function} callback
 */
Mailchimp.prototype.post = function (path, opts, callback) {
  if (!path){
    throw new Error("path requried");
  }
  if (!opts.body){
    throw new Error("body required");
  }

  if (callback) {
    return this.makeRequest("POST", path, opts)
      .then(function (body) {
        callback(null, body);
      })
      .catch(callback);
  } else {
    return this.makeRequest("POST", path, opts);
  }
};

/*
 * put a given data
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} opts - 'got' options such as body and query
 * @param {Function} callback
 */
Mailchimp.prototype.put = function (path, opts, callback) {
  if (!path){
    throw new Error("path requried");
  }
  if (!opts.body){
    throw new Error("body required");
  }

  if (callback) {
    return this.makeRequest("PUT", path, opts)
      .then(function (body) {
        callback(null, body);
      })
      .catch(callback);
  } else {
    return this.makeRequest("PUT", path, opts);
  }
};

/*
 * get data
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} opts - 'got' options such as body and query
 * @param {Object} body - mailchimp body to send
 * @param {Function} callback
 */
Mailchimp.prototype.get = function (path, opts, callback) {
  if (!path){
    throw new Error("path requried");
  }

  if (!callback){
    return this.makeRequest("GET", path, opts);
  } else {
    this.makeRequest("GET", path, opts)
      .then(function (res) {
        callback(null, res.body);
      })
      .catch(callback);
  }
};

module.exports = Mailchimp;
