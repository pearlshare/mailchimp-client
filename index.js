"use strict";

var got = require("got");

function isPlainObj (x) {
	var prototype;
  var toString = Object.prototype.toString;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};


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
  this.logger = (options.logger || function(){});
  this.host = this.host || "https://us8.api.mailchimp.com";
  this.version = this.version || "3.0";
  this.options = options;
};

/*
 * The function that makes requests to the API
 * @param {String} path - The path on the API to make the request to
 * @param {Object} data - The data to send with the request
 * @returns {Promise} promise resolving to a boolean if the request was successful
 */
Mailchimp.prototype.makeRequest = function (method, path, body) {
  var url = this.host + "/" + this.version + "/" + path;
  var headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "apikey " + this.apiKey
  };

  var opts = {
    method: method,
    headers: headers,
    json: true
  }

  if ([undefined, null].indexOf(body) < 0 && isPlainObj(body)) {
    opts.body = JSON.stringify(body);
  }

  return got(url, opts)
    .then(function (res) {
      if (res.error) {
        throw res.error;
      } else {
        return res.body;
      }
    })
    .catch(function (e) {
      throw e;
    });
}

/*
 * post a given data
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} body - mailchimp body to send
 * @param {Function} callback
 */
Mailchimp.prototype.post = function (path, body, callback) {
  if (!path){
    throw new Error("path requried");
  }
  if (!body){
    throw new Error("body required");
  }

  if (!callback){
    return this.makeRequest("POST", path, body);
  } else {
    this.makeRequest("POST", path, body)
      .then(function (resp) {
        callback(false, resp);
      })
      .catch(function (e) {
        callback(e);
      });
  }
};

/*
 * get data
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} body - mailchimp body to send
 * @param {Function} callback
 */
Mailchimp.prototype.get = function (path, callback) {
  if (!path){
    throw new Error("path requried");
  }

  if (!callback){
    return this.makeRequest("GET", path);
  } else {
    this.makeRequest("GET", path)
      .then(function (resp) {
        callback(false, resp);
      })
      .catch(function (e) {
        callback(e);
      });
  }
};

module.exports = Mailchimp;
