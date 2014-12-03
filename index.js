var request = require('superagent');

/*
 * Mailchimp client constructor
 * @param {Object} options
 *  @config {String} apiKey 'xxxx'
 *  @config {String} host - 'https://us8.api.mailchimp.com'
 *  @config {String} version - '2.0'
 *  @config {String} format - 'json'
 *  @config {Object} logger - a logger function which acts like console.log
 *  @config {Object} promise - A+ compliant promise lib such as Bluebird, Q, When.js
 */
var Mailchimp = function (options) {
  if (!options) {
    throw new Error('options object required');
  }
  if (!options.apiKey) {
    throw new Error('Mailchimp - no API key given. Please provide an object with a key of apiKey');
  }

  this.apiKey = options.apiKey;
  this.logger = (options.logger || function(){});
  this.host || (this.host = 'https://us8.api.mailchimp.com');
  this.version || (this.version = '2.0');
  this.format || (this.format = 'json');
  this.promise = options.promise;
  this.options = options;
};

/*
 * perform a given action
 * @param {String} path - path of the action such as lists/subscribe
 * @param {Object} params - mailchimp params to send
 * @param {Function} callback
 */
Mailchimp.prototype.perform = function (path, params, callback) {
  var url;

  if (!path){
    throw new Error('path requried');
  }
  if (!params){
    throw new Error('params required');
  }

  params.apiKey || (params.apiKey = this.apiKey);
  url = '' + this.host + '/' + this.version + '/' + path + '.' + this.format;

  this.logger("sending request to " + url);

  if (!callback){
    if (!this.promise) {
      throw new Error('Please provide a callback or setup with a promise library');
    }
    var deferred = this.promise.defer();

    callback = function(err, resp) {
      if (err){
        deferred.reject(err);
      } else {
        deferred.resolve(resp);
      }
    }
  }

  request
    .post(url)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(params)
    .end(callback);

  if (deferred){
    return deferred.promise
  }
};

module.exports = Mailchimp;