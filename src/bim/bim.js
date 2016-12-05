"use strict";
// import {Injectable} from '@angular/core';
var api_1 = require('./api');
// @Injectable()
var Bim = (function () {
    function Bim() {
        var _this = this;
        this.libHost = 'https://thisisanexperimentalserver.com';
        this.localLibHost = 'bimsurfer/lib/';
        this.localLibPrefix = 'assets/';
        this.libLoaded = false;
        this.setLibHost = function (libHost) {
            if (libHost)
                _this.libHost = libHost;
        };
        this.init = function () {
            var lib0 = new Promise(function (resolve, reject) {
                try {
                    _this.loadScripts(_this.libHost + '/apps/bimserverjavascriptapi/js/', ['bimserverapiwebsocket.js', 'bimserverclient.js', 'bimserverapipromise.js', 'ifc2x3tc1.js', 'ifc4.js', 'model.js', 'translations_en.js'], function () {
                        resolve();
                    }, function (err) {
                        reject(err);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
            var lib1 = new Promise(function (resolve, reject) {
                try {
                    _this.loadScripts(_this.localLibPrefix + _this.localLibHost, ['require.js', 'xeogl.js'], function () {
                        resolve();
                    }, function (err) {
                        reject(err);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
            return Promise.all([lib0, lib1]).then(function () {
                _this.libLoaded = true;
            });
        };
        this.connect = function (address, usernameOrToken, password) {
            return new Promise(function (resolve, reject) {
                _this.address = address;
                // if (this.password === null || this.password === undefined) {
                //   this.token = username
                // }
                // else {
                //   this.username = username
                //   this.password = password
                // }
                _this.username = usernameOrToken;
                _this.password = password;
                if (_this.libLoaded) {
                    return _this._connect().then(function (instance) {
                        resolve(instance);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    _this.init().then(function () {
                        _this._connect().then(function (instance) {
                            resolve(instance);
                        }).catch(function (err) {
                            reject(err);
                        });
                    }).catch(function (err) {
                        reject(err);
                    });
                }
            });
        };
        this.getInstance = function () {
            return _this.instance;
        };
        this._connect = function () {
            return new Promise(function (resolve, reject) {
                _this.loadScripts(_this.address + "/apps/bimserverjavascriptapi/js/", [
                    "bimserverclient.js",
                    "model.js",
                    "bimserverapiwebsocket.js",
                    "bimserverapipromise.js",
                    "geometry.js",
                    "ifc2x3tc1.js",
                    "ifc4.js",
                    "translations_en.js",
                ], function () {
                    var instance = new api_1.Api(_this.address, _this.username, _this.password);
                    instance.login().then(function () {
                        instance.loadLib().then(function () {
                            _this.instance = instance;
                            resolve(_this.instance);
                        }).catch(function (err) {
                            _this.instance = null;
                            reject(err);
                        });
                    }).catch(function (err) {
                        _this.instance = null;
                        reject(err);
                    });
                }, function (err) {
                    reject(err);
                });
            });
        };
        this.loadScript = function (url, callback, onError, timeout) {
            if (timeout === void 0) { timeout = 30000; }
            var script = document.createElement("script");
            script.type = "text/javascript";
            var timer;
            if (script['readyState']) {
                script['onreadystatechange'] = function () {
                    if (script['readyState'] == "loaded" || script['readyState'] == "complete") {
                        script['onreadystatechange'] = null;
                        clearTimeout(timer);
                        timer = null;
                        callback && callback(200, url);
                    }
                };
            }
            else {
                script.onload = function () {
                    clearTimeout(timer);
                    timer = null;
                    callback && callback(200, url);
                };
                script.onerror = function (err) {
                    clearTimeout(timer);
                    timer = null;
                    onError && onError(err, url);
                };
            }
            if (timeout > 0)
                timer = setTimeout(function () {
                    onError && onError('timeout', url);
                    timer = null;
                }, timeout);
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        this.loadScripts = function (baseAddress, filenames, callback, onError, timeout) {
            var counter = filenames.length;
            var index = 0;
            var recursive = function () {
                if (index < counter)
                    _this.loadScript(baseAddress + filenames[index++], recursive, onError, timeout);
                else if (callback)
                    callback();
            };
            recursive();
        };
        window['version'] = new Date().getTime();
        // This has been moved to bimserverapi, can be removed in a day
        String.prototype['firstUpper'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        // Because the demo is in a subfolder compared to the BIMsurfer API, we tell require JS to use the "../" baseUrl
        window['require'] = {
            baseUrl: this.localLibPrefix,
            urlArgs: "bust=" + window['version']
        };
    }
    return Bim;
}());
exports.Bim = Bim;
