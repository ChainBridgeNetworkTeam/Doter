/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "367feefa2b7e0e33b8ef";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "injectScript";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(13)(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/classPrivateFieldLooseBase.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classPrivateFieldLooseBase.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classPrivateFieldBase(receiver, privateKey) {\n  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {\n    throw new TypeError(\"attempted to use private field on non-instance\");\n  }\n\n  return receiver;\n}\n\nmodule.exports = _classPrivateFieldBase;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classPrivateFieldLooseBase.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classPrivateFieldLooseKey.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classPrivateFieldLooseKey.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var id = 0;\n\nfunction _classPrivateFieldKey(name) {\n  return \"__private_\" + id++ + \"_\" + name;\n}\n\nmodule.exports = _classPrivateFieldKey;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classPrivateFieldLooseKey.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperty(obj, key, value) {\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n\n  return obj;\n}\n\nmodule.exports = _defineProperty;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/defineProperty.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : {\n    \"default\": obj\n  };\n}\n\nmodule.exports = _interopRequireDefault;\nmodule.exports[\"default\"] = module.exports, module.exports.__esModule = true;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/interopRequireDefault.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/chunk.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/chunk.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.arrayChunk = arrayChunk;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name arrayChunk\n * @summary Split T[] into T[][] based on the defind size\n * @description\n * Returns a set ao arrays based on the chunksize\n * @example\n * <BR>\n *\n * ```javascript\n * import { arrayChunk } from '@polkadot/util';\n *\n * arrayChunk([1, 2, 3, 4, 5]); // [[1, 2], [3, 4], [5]]\n * ```\n */\nfunction arrayChunk(array, chunkSize) {\n  const outputSize = Math.ceil(array.length / chunkSize);\n  const output = Array(outputSize);\n\n  for (let index = 0; index < outputSize; index++) {\n    const offset = index * chunkSize;\n    output[index] = array.slice(offset, offset + chunkSize);\n  }\n\n  return output;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/chunk.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/filter.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/filter.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.arrayFilter = arrayFilter;\n\nvar _null = __webpack_require__(/*! ../is/null */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js\");\n\nvar _undefined = __webpack_require__(/*! ../is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name arrayFilter\n * @summary Filters undefined and (optionally) null values from an array\n * @description\n * Returns a new array with all `undefined` values removed. Optionally, when `allowNulls = false`, it removes the `null` values as well\n * @example\n * <BR>\n *\n * ```javascript\n * import { arrayFilter } from '@polkadot/util';\n *\n * arrayFilter([0, void 0, true, null, false, '']); // [0, true, null, false, '']\n * arrayFilter([0, void 0, true, null, false, ''], false); // [0, true, false, '']\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction arrayFilter(array, allowNulls = true) {\n  return array.filter(value => !(0, _undefined.isUndefined)(value) && (allowNulls || !(0, _null.isNull)(value)));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/filter.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/flatten.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/flatten.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.arrayFlatten = arrayFlatten;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// This is supposed to be a faster concat...\n// https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki\n\n/**\n * @name arrayFlatten\n * @summary Merge T[][] into T[]\n * @description\n * Returns a new array with all arrays merged into one\n * @example\n * <BR>\n *\n * ```javascript\n * import { arrayFlatten } from '@polkadot/util';\n *\n * arrayFlatten([[1, 2], [3, 4], [5]]); // [1, 2, 3, 4, 5]\n * ```\n */\nfunction arrayFlatten(arrays) {\n  // pre-allocate based on the combined size\n  const output = new Array(arrays.reduce((length, array) => length + array.length, 0));\n  let index = -1;\n\n  for (let a = 0; a < arrays.length; a++) {\n    const array = arrays[a]; // instead of pushing, we just set the entries\n\n    for (let e = 0; e < array.length; e++) {\n      output[++index] = array[e];\n    }\n  }\n\n  return output;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/flatten.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"arrayChunk\", {\n  enumerable: true,\n  get: function () {\n    return _chunk.arrayChunk;\n  }\n});\nObject.defineProperty(exports, \"arrayFilter\", {\n  enumerable: true,\n  get: function () {\n    return _filter.arrayFilter;\n  }\n});\nObject.defineProperty(exports, \"arrayFlatten\", {\n  enumerable: true,\n  get: function () {\n    return _flatten.arrayFlatten;\n  }\n});\n\nvar _chunk = __webpack_require__(/*! ./chunk */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/chunk.js\");\n\nvar _filter = __webpack_require__(/*! ./filter */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/filter.js\");\n\nvar _flatten = __webpack_require__(/*! ./flatten */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/flatten.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.assert = assert;\nexports.assertReturn = assertReturn;\n\nvar _function = __webpack_require__(/*! ./is/function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\nvar _undefined = __webpack_require__(/*! ./is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name assert\n * @summary Checks for a valid test, if not Error is thrown.\n * @description\n * Checks that `test` is a truthy value. If value is falsy (`null`, `undefined`, `false`, ...), it throws an Error with the supplied `message`. When `test` passes, `true` is returned.\n * @example\n * <BR>\n *\n * ```javascript\n * const { assert } from '@polkadot/util';\n *\n * assert(true, 'True should be true'); // passes\n * assert(false, 'False should not be true'); // Error thrown\n * assert(false, () => 'message'); // Error with 'message'\n * ```\n */\nfunction assert(condition, message) {\n  if (!condition) {\n    throw new Error((0, _function.isFunction)(message) ? message() : message);\n  }\n}\n/**\n * @name assertReturn\n * @summart Returns when the value is not undefined, otherwise throws assertion error\n */\n\n\nfunction assertReturn(value, message) {\n  assert(!(0, _undefined.isUndefined)(value), message);\n  return value;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/consts.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/consts.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.BN_MAX_INTEGER = exports.BN_QUINTILL = exports.BN_BILLION = exports.BN_MILLION = exports.BN_THOUSAND = exports.BN_HUNDRED = exports.BN_TEN = exports.BN_NINE = exports.BN_EIGHT = exports.BN_SEVEN = exports.BN_SIX = exports.BN_FIVE = exports.BN_FOUR = exports.BN_THREE = exports.BN_TWO = exports.BN_ONE = exports.BN_ZERO = void 0;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name BN_ZERO\n * @summary BN constant for 0.\n */\nconst BN_ZERO = new _bn.default(0);\n/**\n * @name BN_ONE\n * @summary BN constant for 1.\n */\n\nexports.BN_ZERO = BN_ZERO;\nconst BN_ONE = new _bn.default(1);\n/**\n * @name BN_TWO\n * @summary BN constant for 2.\n */\n\nexports.BN_ONE = BN_ONE;\nconst BN_TWO = new _bn.default(2);\n/**\n * @name BN_THREE\n * @summary BN constant for 3.\n */\n\nexports.BN_TWO = BN_TWO;\nconst BN_THREE = new _bn.default(3);\n/**\n * @name BN_FOUR\n * @summary BN constant for 4.\n */\n\nexports.BN_THREE = BN_THREE;\nconst BN_FOUR = new _bn.default(4);\n/**\n * @name BN_FIVE\n * @summary BN constant for 5.\n */\n\nexports.BN_FOUR = BN_FOUR;\nconst BN_FIVE = new _bn.default(5);\n/**\n * @name BN_SIX\n * @summary BN constant for 6.\n */\n\nexports.BN_FIVE = BN_FIVE;\nconst BN_SIX = new _bn.default(6);\n/**\n * @name BN_SEVEN\n * @summary BN constant for 7.\n */\n\nexports.BN_SIX = BN_SIX;\nconst BN_SEVEN = new _bn.default(7);\n/**\n * @name BN_EIGHT\n * @summary BN constant for 8.\n */\n\nexports.BN_SEVEN = BN_SEVEN;\nconst BN_EIGHT = new _bn.default(8);\n/**\n * @name BN_NINE\n * @summary BN constant for 9.\n */\n\nexports.BN_EIGHT = BN_EIGHT;\nconst BN_NINE = new _bn.default(9);\n/**\n * @name BN_TEN\n * @summary BN constant for 10.\n */\n\nexports.BN_NINE = BN_NINE;\nconst BN_TEN = new _bn.default(10);\n/**\n * @name BN_HUNDRED\n * @summary BN constant for 100.\n */\n\nexports.BN_TEN = BN_TEN;\nconst BN_HUNDRED = new _bn.default(100);\n/**\n * @name BN_THOUSAND\n * @summary BN constant for 1,000.\n */\n\nexports.BN_HUNDRED = BN_HUNDRED;\nconst BN_THOUSAND = new _bn.default(1000);\n/**\n * @name BN_MILLION\n * @summary BN constant for 1,000,000.\n */\n\nexports.BN_THOUSAND = BN_THOUSAND;\nconst BN_MILLION = new _bn.default(1000000);\n/**\n * @name BN_BILLION\n * @summary BN constant for 1,000,000,000.\n */\n\nexports.BN_MILLION = BN_MILLION;\nconst BN_BILLION = new _bn.default(1000000000);\n/**\n * @name BN_QUINTILL\n * @summary BN constant for 1,000,000,000,000,000,000.\n */\n\nexports.BN_BILLION = BN_BILLION;\nconst BN_QUINTILL = BN_BILLION.mul(BN_BILLION);\n/**\n * @name BN_MAX_INTEGER\n * @summary BN constant for MAX_SAFE_INTEGER\n */\n\nexports.BN_QUINTILL = BN_QUINTILL;\nconst BN_MAX_INTEGER = new _bn.default(Number.MAX_SAFE_INTEGER);\nexports.BN_MAX_INTEGER = BN_MAX_INTEGER;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/consts.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/fromHex.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/fromHex.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"bnFromHex\", {\n  enumerable: true,\n  get: function () {\n    return _toBn.hexToBn;\n  }\n});\n\nvar _toBn = __webpack_require__(/*! ../hex/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/fromHex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar _exportNames = {\n  bnFromHex: true,\n  bnMax: true,\n  bnMin: true,\n  bnSqrt: true,\n  bnToBn: true,\n  bnToHex: true,\n  bnToU8a: true\n};\nObject.defineProperty(exports, \"bnFromHex\", {\n  enumerable: true,\n  get: function () {\n    return _fromHex.bnFromHex;\n  }\n});\nObject.defineProperty(exports, \"bnMax\", {\n  enumerable: true,\n  get: function () {\n    return _max.bnMax;\n  }\n});\nObject.defineProperty(exports, \"bnMin\", {\n  enumerable: true,\n  get: function () {\n    return _min.bnMin;\n  }\n});\nObject.defineProperty(exports, \"bnSqrt\", {\n  enumerable: true,\n  get: function () {\n    return _sqrt.bnSqrt;\n  }\n});\nObject.defineProperty(exports, \"bnToBn\", {\n  enumerable: true,\n  get: function () {\n    return _toBn.bnToBn;\n  }\n});\nObject.defineProperty(exports, \"bnToHex\", {\n  enumerable: true,\n  get: function () {\n    return _toHex.bnToHex;\n  }\n});\nObject.defineProperty(exports, \"bnToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.bnToU8a;\n  }\n});\n\nvar _consts = __webpack_require__(/*! ./consts */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/consts.js\");\n\nObject.keys(_consts).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _consts[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _consts[key];\n    }\n  });\n});\n\nvar _fromHex = __webpack_require__(/*! ./fromHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/fromHex.js\");\n\nvar _max = __webpack_require__(/*! ./max */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/max.js\");\n\nvar _min = __webpack_require__(/*! ./min */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/min.js\");\n\nvar _sqrt = __webpack_require__(/*! ./sqrt */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/sqrt.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toHex.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/max.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/max.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnMax = bnMax;\n\nvar _util = __webpack_require__(/*! ./util */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/util.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name bnMax\n * @summary Finds and returns the highest value in an array of BNs.\n * @example\n * <BR>\n *\n * ```javascript\n * import BN from 'bn.js';\n * import { bnMax } from '@polkadot/util';\n *\n * bnMax([new BN(1), new BN(3), new BN(2)]).toString(); // => '3'\n * ```\n */\nfunction bnMax(...items) {\n  return (0, _util.checkMaxMin)('max', items);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/max.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/min.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/min.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnMin = bnMin;\n\nvar _util = __webpack_require__(/*! ./util */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/util.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name bnMin\n * @summary Finds and returns the smallest value in an array of BNs.\n * @example\n * <BR>\n *\n * ```javascript\n * import BN from 'bn.js';\n * import { bnMin } from '@polkadot/util';\n *\n * bnMin([new BN(1), new BN(3), new BN(2)]).toString(); // => '1'\n * ```\n */\nfunction bnMin(...items) {\n  return (0, _util.checkMaxMin)('min', items);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/min.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/sqrt.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/sqrt.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnSqrt = bnSqrt;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _assert = __webpack_require__(/*! ../assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\nvar _bn2 = __webpack_require__(/*! ../bn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name bnSqrt\n * @summary Calculates the integer square root of a BN\n * @example\n * <BR>\n *\n * ```javascript\n * import BN from 'bn.js';\n * import { bnSqrt } from '@polkadot/util';\n *\n * bnSqrt(new BN(16)).toString(); // => '4'\n * ```\n */\nfunction bnSqrt(value) {\n  const n = (0, _toBn.bnToBn)(value);\n  (0, _assert.assert)(n.gte(_bn2.BN_ZERO), 'square root of negative numbers is not supported'); // https://stackoverflow.com/questions/53683995/javascript-big-integer-square-root/\n  // shortcut <= 2^53 - 1 to use the JS utils\n\n  if (n.lte(_bn2.BN_MAX_INTEGER)) {\n    return new _bn.default(Math.floor(Math.sqrt(n.toNumber())));\n  } // Use sqrt(MAX_SAFE_INTEGER) as starting point. since we already know the\n  // output will be larger than this, we expect this to be a safe start\n\n\n  let x0 = new _bn.default(94906265);\n\n  while (true) {\n    const x1 = n.div(x0).iadd(x0).ishrn(1);\n\n    if (x0.eq(x1) || x0.eq(x1.sub(_bn2.BN_ONE))) {\n      return x0;\n    }\n\n    x0 = x1;\n  }\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/sqrt.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnToBn = bnToBn;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _toBn = __webpack_require__(/*! ../hex/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js\");\n\nvar _bigInt = __webpack_require__(/*! ../is/bigInt */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js\");\n\nvar _hex = __webpack_require__(/*! ../is/hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js\");\n\nvar _toBn2 = __webpack_require__(/*! ../is/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/toBn.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction numberToBn(value) {\n  return _bn.default.isBN(value) ? value : (0, _toBn2.isToBn)(value) ? value.toBn() : new _bn.default(value);\n}\n/**\n * @name bnToBn\n * @summary Creates a BN value from a BN, BigInt, string (base 10 or hex) or number input.\n * @description\n * `null` inputs returns a `0x0` result, BN values returns the value, numbers returns a BN representation.\n * @example\n * <BR>\n *\n * ```javascript\n * import BN from 'bn.js';\n * import { bnToBn } from '@polkadot/util';\n *\n * bnToBn(0x1234); // => BN(0x1234)\n * bnToBn(new BN(0x1234)); // => BN(0x1234)\n * ```\n */\n\n\nfunction bnToBn(value) {\n  if (!value) {\n    return new _bn.default(0);\n  } else if ((0, _hex.isHex)(value)) {\n    return (0, _toBn.hexToBn)(value.toString());\n  } else if ((0, _bigInt.isBigInt)(value)) {\n    return new _bn.default(value.toString());\n  }\n\n  return numberToBn(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toHex.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toHex.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnToHex = bnToHex;\n\nvar _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\"));\n\nvar _number = __webpack_require__(/*! ../is/number */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js\");\n\nvar _u8a = __webpack_require__(/*! ../u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toU8a.js\");\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nconst ZERO_STR = '0x00';\n\nfunction bnToHex(value, arg1 = {\n  bitLength: -1,\n  isLe: false,\n  isNegative: false\n}, arg2) {\n  if (!value) {\n    return ZERO_STR;\n  }\n\n  const _options = _objectSpread({\n    isLe: false,\n    isNegative: false\n  }, (0, _number.isNumber)(arg1) ? {\n    bitLength: arg1,\n    isLe: arg2\n  } : arg1);\n\n  return (0, _u8a.u8aToHex)((0, _toU8a.bnToU8a)(value, _options));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toHex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toU8a.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toU8a.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bnToU8a = bnToU8a;\n\nvar _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\"));\n\nvar _number = __webpack_require__(/*! ../is/number */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction createEmpty(byteLength, options) {\n  return options.bitLength === -1 ? new Uint8Array() : new Uint8Array(byteLength);\n}\n\nfunction createValue(valueBn, byteLength, {\n  isLe,\n  isNegative\n}) {\n  const output = new Uint8Array(byteLength);\n  const bn = isNegative ? valueBn.toTwos(byteLength * 8) : valueBn;\n  output.set(bn.toArray(isLe ? 'le' : 'be', byteLength), 0);\n  return output;\n}\n/**\n * @name bnToU8a\n * @summary Creates a Uint8Array object from a BN.\n * @description\n * `null`/`undefined`/`NaN` inputs returns an empty `Uint8Array` result. `BN` input values return the actual bytes value converted to a `Uint8Array`. Optionally convert using little-endian format if `isLE` is set.\n * @example\n * <BR>\n *\n * ```javascript\n * import { bnToU8a } from '@polkadot/util';\n *\n * bnToU8a(new BN(0x1234)); // => [0x12, 0x34]\n * ```\n */\n\n\nfunction bnToU8a(value, arg1 = {\n  bitLength: -1,\n  isLe: true,\n  isNegative: false\n}, arg2) {\n  const options = _objectSpread({\n    bitLength: -1,\n    isLe: true,\n    isNegative: false\n  }, (0, _number.isNumber)(arg1) ? {\n    bitLength: arg1,\n    isLe: arg2\n  } : arg1);\n\n  const valueBn = (0, _toBn.bnToBn)(value);\n  const byteLength = options.bitLength === -1 ? Math.ceil(valueBn.bitLength() / 8) : Math.ceil((options.bitLength || 0) / 8);\n  return value ? createValue(valueBn, byteLength, options) : createEmpty(byteLength, options);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/util.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/util.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.checkMaxMin = checkMaxMin;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _assert = __webpack_require__(/*! ../assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction checkMaxMin(type, items) {\n  (0, _assert.assert)(items.length >= 1, 'Must provide one or more BN arguments');\n  return items.reduce((acc, val) => _bn.default[type](acc, val), items[0]);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/util.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"bufferToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.bufferToU8a;\n  }\n});\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/toU8a.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/toU8a.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.bufferToU8a = bufferToU8a;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name bufferToU8a\n * @summary Creates a Uint8Array value from a Buffer object.\n * @description\n * `null` inputs returns an empty result, `Buffer` values return the actual value as a `Uint8Array`. Anything that is not a `Buffer` object throws an error.\n * @example\n * <BR>\n *\n * ```javascript\n * import { bufferToU8a } from '@polkadot/util';\n *\n * bufferToU8a(Buffer.from([1, 2, 3]));\n * ```\n */\nfunction bufferToU8a(buffer) {\n  return new Uint8Array(buffer || []);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/addLength.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/addLength.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.compactAddLength = compactAddLength;\n\nvar _u8a = __webpack_require__(/*! ../u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name compactAddLength\n * @description Adds a length prefix to the input value\n * @example\n * <BR>\n *\n * ```javascript\n * import { compactAddLength } from '@polkadot/util';\n *\n * console.log(compactAddLength(new Uint8Array([0xde, 0xad, 0xbe, 0xef]))); // Uint8Array([4 << 2, 0xde, 0xad, 0xbe, 0xef])\n * ```\n */\nfunction compactAddLength(input) {\n  return (0, _u8a.u8aConcat)((0, _toU8a.compactToU8a)(input.length), input);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/addLength.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/defaults.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/defaults.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.DEFAULT_BITLENGTH = void 0;\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst DEFAULT_BITLENGTH = 32;\nexports.DEFAULT_BITLENGTH = DEFAULT_BITLENGTH;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/defaults.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/fromU8a.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/fromU8a.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.compactFromU8a = compactFromU8a;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _u8a = __webpack_require__(/*! ../u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js\");\n\nvar _defaults = __webpack_require__(/*! ./defaults */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/defaults.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name compactFromU8a\n * @description Retrievs the offset and encoded length from a compact-prefixed value\n * @example\n * <BR>\n *\n * ```javascript\n * import { compactFromU8a } from '@polkadot/util';\n *\n * const [offset, length] = compactFromU8a(new Uint8Array([254, 255, 3, 0]), 32));\n *\n * console.log('value offset=', offset, 'length=', length); // 4, 0xffff\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/no-unused-vars\nfunction compactFromU8a(_input, bitLength = _defaults.DEFAULT_BITLENGTH) {\n  const input = (0, _u8a.u8aToU8a)(_input);\n  const flag = input[0] & 0b11;\n\n  if (flag === 0b00) {\n    return [1, new _bn.default(input[0]).shrn(2)];\n  } else if (flag === 0b01) {\n    return [2, (0, _u8a.u8aToBn)(input.slice(0, 2), true).shrn(2)];\n  } else if (flag === 0b10) {\n    return [4, (0, _u8a.u8aToBn)(input.slice(0, 4), true).shrn(2)];\n  }\n\n  const length = new _bn.default(input[0]).shrn(2) // clear flag\n  .addn(4) // add 4 for base length\n  .toNumber();\n  const offset = 1 + length;\n  return [offset, (0, _u8a.u8aToBn)(input.subarray(1, offset), true)];\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/fromU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/index.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/index.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"compactAddLength\", {\n  enumerable: true,\n  get: function () {\n    return _addLength.compactAddLength;\n  }\n});\nObject.defineProperty(exports, \"compactStripLength\", {\n  enumerable: true,\n  get: function () {\n    return _stripLength.compactStripLength;\n  }\n});\nObject.defineProperty(exports, \"compactFromU8a\", {\n  enumerable: true,\n  get: function () {\n    return _fromU8a.compactFromU8a;\n  }\n});\nObject.defineProperty(exports, \"compactToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.compactToU8a;\n  }\n});\n\nvar _addLength = __webpack_require__(/*! ./addLength */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/addLength.js\");\n\nvar _stripLength = __webpack_require__(/*! ./stripLength */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/stripLength.js\");\n\nvar _fromU8a = __webpack_require__(/*! ./fromU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/fromU8a.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/stripLength.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/stripLength.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.compactStripLength = compactStripLength;\n\nvar _defaults = __webpack_require__(/*! ./defaults */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/defaults.js\");\n\nvar _fromU8a = __webpack_require__(/*! ./fromU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/fromU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name compactStripLength\n * @description Removes the length prefix, returning both the total length (including the value + compact encoding) and the decoded value with the correct length\n * @example\n * <BR>\n *\n * ```javascript\n * import { compactStripLength } from '@polkadot/util';\n *\n * console.log(compactStripLength(new Uint8Array([2 << 2, 0xde, 0xad]))); // [2, Uint8Array[0xde, 0xad]]\n * ```\n */\nfunction compactStripLength(input, bitLength = _defaults.DEFAULT_BITLENGTH) {\n  const [offset, length] = (0, _fromU8a.compactFromU8a)(input, bitLength);\n  const total = offset + length.toNumber();\n  return [total, input.subarray(offset, total)];\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/stripLength.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/toU8a.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/toU8a.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.compactToU8a = compactToU8a;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _assert = __webpack_require__(/*! ../assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\nvar _bn2 = __webpack_require__(/*! ../bn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js\");\n\nvar _u8a = __webpack_require__(/*! ../u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst MAX_U8 = new _bn.default(2).pow(new _bn.default(8 - 2)).subn(1);\nconst MAX_U16 = new _bn.default(2).pow(new _bn.default(16 - 2)).subn(1);\nconst MAX_U32 = new _bn.default(2).pow(new _bn.default(32 - 2)).subn(1);\n/**\n * @name compactToU8a\n * @description Encodes a number into a compact representation\n * @example\n * <BR>\n *\n * ```javascript\n * import { compactToU8a } from '@polkadot/util';\n *\n * console.log(compactToU8a(511, 32)); // Uint8Array([0b11111101, 0b00000111])\n * ```\n */\n\nfunction compactToU8a(_value) {\n  const value = (0, _bn2.bnToBn)(_value);\n\n  if (value.lte(MAX_U8)) {\n    return new Uint8Array([value.toNumber() << 2]);\n  } else if (value.lte(MAX_U16)) {\n    return (0, _bn2.bnToU8a)(value.shln(2).addn(0b01), 16, true);\n  } else if (value.lte(MAX_U32)) {\n    return (0, _bn2.bnToU8a)(value.shln(2).addn(0b10), 32, true);\n  }\n\n  const u8a = (0, _bn2.bnToU8a)(value);\n  let length = u8a.length; // adjust to the minimum number of bytes\n\n  while (u8a[length - 1] === 0) {\n    length--;\n  }\n\n  (0, _assert.assert)(length >= 4, 'Previous tests match anyting less than 2^30; qed');\n  return (0, _u8a.u8aConcat)(new Uint8Array([// substract 4 as minimum (also catered for in decoding)\n  (length - 4 << 2) + 0b11]), u8a.subarray(0, length));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/detectPackage.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/detectPackage.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\n\nvar _xTextdecoder = __webpack_require__(/*! @polkadot/x-textdecoder */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/browser.js\");\n\nvar _xTextencoder = __webpack_require__(/*! @polkadot/x-textencoder */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/browser.js\");\n\nvar _packageInfo = __webpack_require__(/*! ./packageInfo */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/packageInfo.js\");\n\nvar _versionDetect = __webpack_require__(/*! ./versionDetect */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/versionDetect.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// For esm, this should be import.meta.url or to get the same behavior as __dirname, we can use\n//\n//   new URL(import.meta.url).pathname)\n//\n// The issue is the WP4 has \"some\" issues with import.meta.url. So because of bundlers, we can't have\n// nice things... In this case it is even worse since import.meta.url won't even make it compile, so\n// there is a complete dead end with usage thereof\n//\n// When that is fixed, a solution is to have both .js & .mjs files, with the following content -\n//\n// cjs: util.detectPackage(packageInfo, () => __dirname);\n// esm: detectPackage(packageInfo, () => import.meta.url);\n//\n// With the above we additionally need a .d.ts to just export the packageInfo\n(0, _versionDetect.detectPackage)(_packageInfo.packageInfo,  true && __dirname, [_xTextdecoder.packageInfo, _xTextencoder.packageInfo]);\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/detectPackage.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/extractTime.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/extractTime.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.extractTime = extractTime;\n\nvar _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\"));\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst HRS = 60 * 60;\nconst DAY = HRS * 24;\n/**\n * @name addTime\n * @summary Add together two Time arrays\n */\n\nfunction addTime(a, b) {\n  return {\n    days: a.days + b.days,\n    hours: a.hours + b.hours,\n    milliseconds: a.milliseconds + b.milliseconds,\n    minutes: a.minutes + b.minutes,\n    seconds: a.seconds + b.seconds\n  };\n}\n\nconst ZERO = {\n  days: 0,\n  hours: 0,\n  milliseconds: 0,\n  minutes: 0,\n  seconds: 0\n};\n\nfunction extractDays(milliseconds, hrs) {\n  const days = Math.floor(hrs / 24);\n  return addTime(_objectSpread(_objectSpread({}, ZERO), {}, {\n    days\n  }), extractTime(milliseconds - days * DAY * 1000));\n}\n\nfunction extractHrs(milliseconds, mins) {\n  const hrs = mins / 60;\n\n  if (hrs < 24) {\n    const hours = Math.floor(hrs);\n    return addTime(_objectSpread(_objectSpread({}, ZERO), {}, {\n      hours\n    }), extractTime(milliseconds - hours * HRS * 1000));\n  }\n\n  return extractDays(milliseconds, hrs);\n}\n\nfunction extractMins(milliseconds, secs) {\n  const mins = secs / 60;\n\n  if (mins < 60) {\n    const minutes = Math.floor(mins);\n    return addTime(_objectSpread(_objectSpread({}, ZERO), {}, {\n      minutes\n    }), extractTime(milliseconds - minutes * 60 * 1000));\n  }\n\n  return extractHrs(milliseconds, mins);\n}\n\nfunction extractSecs(milliseconds) {\n  const secs = milliseconds / 1000;\n\n  if (secs < 60) {\n    const seconds = Math.floor(secs);\n    return addTime(_objectSpread(_objectSpread({}, ZERO), {}, {\n      seconds\n    }), extractTime(milliseconds - seconds * 1000));\n  }\n\n  return extractMins(milliseconds, secs);\n}\n/**\n * @name extractTime\n * @summary Convert a quantity of seconds to Time array representing accumulated {days, minutes, hours, seconds, milliseconds}\n * @example\n * <BR>\n *\n * ```javascript\n * import { extractTime } from '@polkadot/util';\n *\n * const { days, minutes, hours, seconds, milliseconds } = extractTime(6000); // 0, 0, 10, 0, 0\n * ```\n */\n\n\nfunction extractTime(milliseconds) {\n  if (!milliseconds) {\n    return ZERO;\n  } else if (milliseconds < 1000) {\n    return _objectSpread(_objectSpread({}, ZERO), {}, {\n      milliseconds\n    });\n  }\n\n  return extractSecs(milliseconds);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/extractTime.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatBalance.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatBalance.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.formatBalance = void 0;\n\nvar _toBn = __webpack_require__(/*! ../bn/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\nvar _boolean = __webpack_require__(/*! ../is/boolean */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js\");\n\nvar _undefined = __webpack_require__(/*! ../is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\nvar _formatDecimal = __webpack_require__(/*! ./formatDecimal */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js\");\n\nvar _si = __webpack_require__(/*! ./si */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/si.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst DEFAULT_DECIMALS = 0;\nconst DEFAULT_UNIT = _si.SI[_si.SI_MID].text;\nlet defaultDecimals = DEFAULT_DECIMALS;\nlet defaultUnit = DEFAULT_UNIT; // Formats a string/number with <prefix>.<postfix><type> notation\n\nfunction _formatBalance(input, options = true, optDecimals = defaultDecimals) {\n  let text = (0, _toBn.bnToBn)(input).toString();\n\n  if (text.length === 0 || text === '0') {\n    return '0';\n  } // strip the negative sign so we can work with clean groupings, re-add this in the\n  // end when we return the result (from here on we work with positive numbers)\n\n\n  const isNegative = text[0].startsWith('-');\n\n  if (isNegative) {\n    text = text.substr(1);\n  } // extract options - the boolean case is for backwards-compat\n\n\n  const {\n    decimals = optDecimals,\n    forceUnit = undefined,\n    withSi = true,\n    withSiFull = false,\n    withUnit = true\n  } = (0, _boolean.isBoolean)(options) ? {\n    withSi: options\n  } : options; // NOTE We start at midpoint (8) minus 1 - this means that values display as\n  // 123.456 instead of 0.123k (so always 6 relevant). Additionally we use ceil\n  // so there are at most 3 decimal before the decimal separator\n\n  const si = (0, _si.calcSi)(text, decimals, forceUnit);\n  const mid = text.length - (decimals + si.power);\n  const prefix = text.substr(0, mid);\n  const padding = mid < 0 ? 0 - mid : 0;\n  const postfix = `${`${new Array(padding + 1).join('0')}${text}`.substr(mid < 0 ? 0 : mid)}0000`.substr(0, 4);\n  const units = withSi || withSiFull ? si.value === '-' ? withUnit ? ` ${(0, _boolean.isBoolean)(withUnit) ? si.text : withUnit}` : '' : ` ${withSiFull ? si.text : si.value}${withUnit ? `${withSiFull ? ' ' : ''}${(0, _boolean.isBoolean)(withUnit) ? _si.SI[_si.SI_MID].text : withUnit}` : ''}` : '';\n  return `${isNegative ? '-' : ''}${(0, _formatDecimal.formatDecimal)(prefix || '0')}.${postfix}${units}`;\n}\n\nconst formatBalance = _formatBalance; // eslint-disable-next-line @typescript-eslint/unbound-method\n\nexports.formatBalance = formatBalance;\n\nformatBalance.calcSi = (text, decimals = defaultDecimals) => (0, _si.calcSi)(text, decimals); // eslint-disable-next-line @typescript-eslint/unbound-method\n\n\nformatBalance.findSi = _si.findSi; // eslint-disable-next-line @typescript-eslint/unbound-method\n\nformatBalance.getDefaults = () => {\n  return {\n    decimals: defaultDecimals,\n    unit: defaultUnit\n  };\n}; // get allowable options to display in a dropdown\n// eslint-disable-next-line @typescript-eslint/unbound-method\n\n\nformatBalance.getOptions = (decimals = defaultDecimals) => {\n  return _si.SI.filter(({\n    power\n  }) => power < 0 ? decimals + power >= 0 : true);\n}; // Sets the default decimals to use for formatting (ui-wide)\n// eslint-disable-next-line @typescript-eslint/unbound-method\n\n\nformatBalance.setDefaults = ({\n  decimals,\n  unit\n}) => {\n  defaultDecimals = (0, _undefined.isUndefined)(decimals) ? defaultDecimals : Array.isArray(decimals) ? decimals[0] : decimals;\n  defaultUnit = (0, _undefined.isUndefined)(unit) ? defaultUnit : Array.isArray(unit) ? unit[0] : unit;\n  _si.SI[_si.SI_MID].text = defaultUnit;\n};\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatBalance.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDate.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDate.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.formatDate = formatDate;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/** @internal */\nfunction zeroPad(value) {\n  return value.toString().padStart(2, '0');\n}\n\nfunction formatDate(date) {\n  const year = date.getFullYear().toString();\n  const month = zeroPad(date.getMonth() + 1);\n  const day = zeroPad(date.getDate());\n  const hour = zeroPad(date.getHours());\n  const minute = zeroPad(date.getMinutes());\n  const second = zeroPad(date.getSeconds());\n  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDate.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.formatDecimal = formatDecimal;\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// eslint-disable-next-line prefer-regex-literals\nconst NUMBER_REGEX = new RegExp('(\\\\d+?)(?=(\\\\d{3})+(?!\\\\d)|$)', 'g');\n\nfunction formatDecimal(value) {\n  // We can do this by adjusting the regx, however for the sake of clarity\n  // we rather strip and re-add the negative sign in the output\n  const isNegative = value[0].startsWith('-');\n  const matched = isNegative ? value.substr(1).match(NUMBER_REGEX) : value.match(NUMBER_REGEX);\n  return matched ? `${isNegative ? '-' : ''}${matched.join(',')}` : value;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatElapsed.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatElapsed.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.formatElapsed = formatElapsed;\n\nvar _toBn = __webpack_require__(/*! ../bn/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\n// Copyright 2017-2021 @polkadot/ui-util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction formatValue(elapsed) {\n  if (elapsed < 15) {\n    return `${elapsed.toFixed(1)}s`;\n  } else if (elapsed < 60) {\n    return `${elapsed | 0}s`;\n  } else if (elapsed < 3600) {\n    return `${elapsed / 60 | 0}m`;\n  }\n\n  return `${elapsed / 3600 | 0}h`;\n}\n\nfunction formatElapsed(now, value) {\n  const tsNow = now && now.getTime() || 0;\n  const tsValue = value instanceof Date ? value.getTime() : (0, _toBn.bnToBn)(value).toNumber();\n  return tsNow && tsValue ? formatValue(Math.max(Math.abs(tsNow - tsValue), 0) / 1000) : '0.0s';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatElapsed.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatNumber.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatNumber.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.formatNumber = formatNumber;\n\nvar _toBn = __webpack_require__(/*! ../bn/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/toBn.js\");\n\nvar _formatDecimal = __webpack_require__(/*! ./formatDecimal */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction formatNumber(value) {\n  return (0, _formatDecimal.formatDecimal)((0, _toBn.bnToBn)(value).toString());\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatNumber.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"formatBalance\", {\n  enumerable: true,\n  get: function () {\n    return _formatBalance.formatBalance;\n  }\n});\nObject.defineProperty(exports, \"formatDate\", {\n  enumerable: true,\n  get: function () {\n    return _formatDate.formatDate;\n  }\n});\nObject.defineProperty(exports, \"formatDecimal\", {\n  enumerable: true,\n  get: function () {\n    return _formatDecimal.formatDecimal;\n  }\n});\nObject.defineProperty(exports, \"formatElapsed\", {\n  enumerable: true,\n  get: function () {\n    return _formatElapsed.formatElapsed;\n  }\n});\nObject.defineProperty(exports, \"formatNumber\", {\n  enumerable: true,\n  get: function () {\n    return _formatNumber.formatNumber;\n  }\n});\nObject.defineProperty(exports, \"calcSi\", {\n  enumerable: true,\n  get: function () {\n    return _si.calcSi;\n  }\n});\nObject.defineProperty(exports, \"findSi\", {\n  enumerable: true,\n  get: function () {\n    return _si.findSi;\n  }\n});\n\nvar _formatBalance = __webpack_require__(/*! ./formatBalance */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatBalance.js\");\n\nvar _formatDate = __webpack_require__(/*! ./formatDate */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDate.js\");\n\nvar _formatDecimal = __webpack_require__(/*! ./formatDecimal */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDecimal.js\");\n\nvar _formatElapsed = __webpack_require__(/*! ./formatElapsed */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatElapsed.js\");\n\nvar _formatNumber = __webpack_require__(/*! ./formatNumber */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatNumber.js\");\n\nvar _si = __webpack_require__(/*! ./si */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/si.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/si.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/si.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.findSi = findSi;\nexports.calcSi = calcSi;\nexports.SI = exports.SI_MID = void 0;\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst SI_MID = 8;\nexports.SI_MID = SI_MID;\nconst SI = [{\n  power: -24,\n  text: 'yocto',\n  value: 'y'\n}, {\n  power: -21,\n  text: 'zepto',\n  value: 'z'\n}, {\n  power: -18,\n  text: 'atto',\n  value: 'a'\n}, {\n  power: -15,\n  text: 'femto',\n  value: 'f'\n}, {\n  power: -12,\n  text: 'pico',\n  value: 'p'\n}, {\n  power: -9,\n  text: 'nano',\n  value: 'n'\n}, {\n  power: -6,\n  text: 'micro',\n  value: 'µ'\n}, {\n  power: -3,\n  text: 'milli',\n  value: 'm'\n}, {\n  power: 0,\n  text: 'Unit',\n  value: '-'\n}, // position 8\n{\n  power: 3,\n  text: 'Kilo',\n  value: 'k'\n}, {\n  power: 6,\n  text: 'Mill',\n  value: 'M'\n}, // Mega, M\n{\n  power: 9,\n  text: 'Bill',\n  value: 'B'\n}, // Giga, G\n{\n  power: 12,\n  text: 'Tril',\n  value: 'T'\n}, // Tera, T\n{\n  power: 15,\n  text: 'Peta',\n  value: 'P'\n}, {\n  power: 18,\n  text: 'Exa',\n  value: 'E'\n}, {\n  power: 21,\n  text: 'Zeta',\n  value: 'Z'\n}, {\n  power: 24,\n  text: 'Yotta',\n  value: 'Y'\n}]; // Given a SI type (e.g. k, m, Y) find the SI definition\n\nexports.SI = SI;\n\nfunction findSi(type) {\n  // use a loop here, better RN support (which doesn't have [].find)\n  for (let i = 0; i < SI.length; i++) {\n    if (SI[i].value === type) {\n      return SI[i];\n    }\n  }\n\n  return SI[SI_MID];\n}\n\nfunction calcSi(text, decimals, forceUnit) {\n  if (forceUnit) {\n    return findSi(forceUnit);\n  }\n\n  const siDefIndex = SI_MID - 1 + Math.ceil((text.length - decimals) / 3);\n  return SI[siDefIndex] || SI[siDefIndex < 0 ? 0 : SI.length - 1];\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/si.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/addPrefix.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/addPrefix.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexAddPrefix = hexAddPrefix;\n\nvar _hasPrefix = __webpack_require__(/*! ./hasPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexAddPrefix\n * @summary Adds the `0x` prefix to string values.\n * @description\n * Returns a `0x` prefixed string from the input value. If the input is already prefixed, it is returned unchanged.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexAddPrefix } from '@polkadot/util';\n *\n * console.log('With prefix', hexAddPrefix('0a0b12')); // => 0x0a0b12\n * ```\n */\nfunction hexAddPrefix(value) {\n  if (value && (0, _hasPrefix.hexHasPrefix)(value)) {\n    return value;\n  }\n\n  const prefix = value && value.length % 2 === 1 ? '0' : '';\n  return `0x${prefix}${value || ''}`;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/addPrefix.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/fixLength.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/fixLength.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexFixLength = hexFixLength;\n\nvar _addPrefix = __webpack_require__(/*! ./addPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/addPrefix.js\");\n\nvar _stripPrefix = __webpack_require__(/*! ./stripPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexFixLength\n * @summary Shifts a hex string to a specific bitLength\n * @description\n * Returns a `0x` prefixed string with the specified number of bits contained in the return value. (If bitLength is -1, length checking is not done). Values with more bits are trimmed to the specified length. Input values with less bits are returned as-is by default. When `withPadding` is set, shorter values are padded with `0`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexFixLength } from '@polkadot/util';\n *\n * console.log('fixed', hexFixLength('0x12', 16)); // => 0x12\n * console.log('fixed', hexFixLength('0x12', 16, true)); // => 0x0012\n * console.log('fixed', hexFixLength('0x0012', 8)); // => 0x12\n * ```\n */\nfunction hexFixLength(value, bitLength = -1, withPadding = false) {\n  const strLength = Math.ceil(bitLength / 4);\n  const hexLength = strLength + 2;\n  return (0, _addPrefix.hexAddPrefix)(bitLength === -1 || value.length === hexLength || !withPadding && value.length < hexLength ? (0, _stripPrefix.hexStripPrefix)(value) : value.length > hexLength ? (0, _stripPrefix.hexStripPrefix)(value).slice(-1 * strLength) : `${'0'.repeat(strLength)}${(0, _stripPrefix.hexStripPrefix)(value)}`.slice(-1 * strLength));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/fixLength.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexHasPrefix = hexHasPrefix;\n\nvar _hex = __webpack_require__(/*! ../is/hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexHasPrefix\n * @summary Tests for the existence of a `0x` prefix.\n * @description\n * Checks for a valid hex input value and if the start matched `0x`\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexHasPrefix } from '@polkadot/util';\n *\n * console.log('has prefix', hexHasPrefix('0x1234')); // => true\n * ```\n */\nfunction hexHasPrefix(value) {\n  return !!(value && (0, _hex.isHex)(value, -1, true) && value.substr(0, 2) === '0x');\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/index.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"hexAddPrefix\", {\n  enumerable: true,\n  get: function () {\n    return _addPrefix.hexAddPrefix;\n  }\n});\nObject.defineProperty(exports, \"hexFixLength\", {\n  enumerable: true,\n  get: function () {\n    return _fixLength.hexFixLength;\n  }\n});\nObject.defineProperty(exports, \"hexHasPrefix\", {\n  enumerable: true,\n  get: function () {\n    return _hasPrefix.hexHasPrefix;\n  }\n});\nObject.defineProperty(exports, \"hexStripPrefix\", {\n  enumerable: true,\n  get: function () {\n    return _stripPrefix.hexStripPrefix;\n  }\n});\nObject.defineProperty(exports, \"hexToBn\", {\n  enumerable: true,\n  get: function () {\n    return _toBn.hexToBn;\n  }\n});\nObject.defineProperty(exports, \"hexToNumber\", {\n  enumerable: true,\n  get: function () {\n    return _toNumber.hexToNumber;\n  }\n});\nObject.defineProperty(exports, \"hexToString\", {\n  enumerable: true,\n  get: function () {\n    return _toString.hexToString;\n  }\n});\nObject.defineProperty(exports, \"hexToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.hexToU8a;\n  }\n});\n\nvar _addPrefix = __webpack_require__(/*! ./addPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/addPrefix.js\");\n\nvar _fixLength = __webpack_require__(/*! ./fixLength */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/fixLength.js\");\n\nvar _hasPrefix = __webpack_require__(/*! ./hasPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js\");\n\nvar _stripPrefix = __webpack_require__(/*! ./stripPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js\");\n\nvar _toNumber = __webpack_require__(/*! ./toNumber */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toNumber.js\");\n\nvar _toString = __webpack_require__(/*! ./toString */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toString.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexStripPrefix = hexStripPrefix;\n\nvar _hasPrefix = __webpack_require__(/*! ./hasPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/hasPrefix.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst UNPREFIX_HEX_REGEX = /^[a-fA-F0-9]+$/;\n/**\n * @name hexStripPrefix\n * @summary Strips any leading `0x` prefix.\n * @description\n * Tests for the existence of a `0x` prefix, and returns the value without the prefix. Un-prefixed values are returned as-is.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexStripPrefix } from '@polkadot/util';\n *\n * console.log('stripped', hexStripPrefix('0x1234')); // => 1234\n * ```\n */\n\nfunction hexStripPrefix(value) {\n  if (!value) {\n    return '';\n  }\n\n  if ((0, _hasPrefix.hexHasPrefix)(value)) {\n    return value.substr(2);\n  }\n\n  if (UNPREFIX_HEX_REGEX.test(value)) {\n    return value;\n  }\n\n  throw new Error(`Invalid hex ${value} passed to hexStripPrefix`);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexToBn = hexToBn;\n\nvar _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\"));\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\nvar _boolean = __webpack_require__(/*! ../is/boolean */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js\");\n\nvar _stripPrefix = __webpack_require__(/*! ./stripPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js\");\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction reverse(value) {\n  return (value.match(/.{1,2}/g) || []).reverse().join('');\n}\n/**\n * @name hexToBn\n * @summary Creates a BN.js bignumber object from a hex string.\n * @description\n * `null` inputs returns a `BN(0)` result. Hex input values return the actual value converted to a BN. Anything that is not a hex string (including the `0x` prefix) throws an error.\n * @param _value The value to convert\n * @param _options Options to pass while converting\n * @param _options.isLe Convert using Little Endian\n * @param _options.isNegative Convert using two's complement\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexToBn } from '@polkadot/util';\n *\n * hexToBn('0x123480001f'); // => BN(0x123480001f)\n * ```\n */\n\n\nfunction hexToBn(value, options = {\n  isLe: false,\n  isNegative: false\n}) {\n  if (!value) {\n    return new _bn.default(0);\n  }\n\n  const _options = _objectSpread({\n    isLe: false,\n    isNegative: false\n  }, (0, _boolean.isBoolean)(options) ? {\n    isLe: options\n  } : options);\n\n  const _value = (0, _stripPrefix.hexStripPrefix)(value); // FIXME: Use BN's 3rd argument `isLe` once this issue is fixed\n  // https://github.com/indutny/bn.js/issues/208\n\n\n  const bn = new _bn.default((_options.isLe ? reverse(_value) : _value) || '00', 16); // fromTwos takes as parameter the number of bits, which is the hex length\n  // multiplied by 4.\n\n  return _options.isNegative ? bn.fromTwos(_value.length * 4) : bn;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toNumber.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toNumber.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexToNumber = hexToNumber;\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexToNumber\n * @summary Creates a Number value from a Buffer object.\n * @description\n * `null` inputs returns an NaN result, `hex` values return the actual value as a `Number`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexToNumber } from '@polkadot/util';\n *\n * hexToNumber('0x1234'); // => 0x1234\n * ```\n */\nfunction hexToNumber(value) {\n  return value ? (0, _toBn.hexToBn)(value).toNumber() : NaN;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toNumber.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toString.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toString.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexToString = hexToString;\n\nvar _toString = __webpack_require__(/*! ../u8a/toString */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toString.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexToU8a\n * @summary Creates a Uint8Array object from a hex string.\n * @description\n * Hex input values return the actual bytes value converted to a string. Anything that is not a hex string (including the `0x` prefix) throws an error.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexToString } from '@polkadot/util';\n *\n * hexToU8a('0x68656c6c6f'); // hello\n * ```\n */\nfunction hexToString(_value) {\n  return (0, _toString.u8aToString)((0, _toU8a.hexToU8a)(_value));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toString.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.hexToU8a = hexToU8a;\n\nvar _assert = __webpack_require__(/*! ../assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\nvar _hex = __webpack_require__(/*! ../is/hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js\");\n\nvar _stripPrefix = __webpack_require__(/*! ./stripPrefix */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/stripPrefix.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name hexToU8a\n * @summary Creates a Uint8Array object from a hex string.\n * @description\n * `null` inputs returns an empty `Uint8Array` result. Hex input values return the actual bytes value converted to a Uint8Array. Anything that is not a hex string (including the `0x` prefix) throws an error.\n * @example\n * <BR>\n *\n * ```javascript\n * import { hexToU8a } from '@polkadot/util';\n *\n * hexToU8a('0x80001f'); // Uint8Array([0x80, 0x00, 0x1f])\n * hexToU8a('0x80001f', 32); // Uint8Array([0x00, 0x80, 0x00, 0x1f])\n * ```\n */\nfunction hexToU8a(_value, bitLength = -1) {\n  if (!_value) {\n    return new Uint8Array();\n  }\n\n  (0, _assert.assert)((0, _hex.isHex)(_value), `Expected hex value to convert, found '${_value}'`);\n  const value = (0, _stripPrefix.hexStripPrefix)(_value);\n  const valLength = value.length / 2;\n  const bufLength = Math.ceil(bitLength === -1 ? valLength : bitLength / 8);\n  const result = new Uint8Array(bufLength);\n  const offset = Math.max(0, bufLength - valLength);\n\n  for (let index = 0; index < bufLength; index++) {\n    result[index + offset] = parseInt(value.substr(index * 2, 2), 16);\n  }\n\n  return result;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/index.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar _exportNames = {\n  packageInfo: true\n};\nObject.defineProperty(exports, \"packageInfo\", {\n  enumerable: true,\n  get: function () {\n    return _packageInfo.packageInfo;\n  }\n});\n\n__webpack_require__(/*! ./detectPackage */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/detectPackage.js\");\n\nvar _packageInfo = __webpack_require__(/*! ./packageInfo */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/packageInfo.js\");\n\nvar _array = __webpack_require__(/*! ./array */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/array/index.js\");\n\nObject.keys(_array).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _array[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _array[key];\n    }\n  });\n});\n\nvar _assert = __webpack_require__(/*! ./assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\nObject.keys(_assert).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _assert[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _assert[key];\n    }\n  });\n});\n\nvar _bn = __webpack_require__(/*! ./bn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/bn/index.js\");\n\nObject.keys(_bn).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _bn[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _bn[key];\n    }\n  });\n});\n\nvar _buffer = __webpack_require__(/*! ./buffer */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/index.js\");\n\nObject.keys(_buffer).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _buffer[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _buffer[key];\n    }\n  });\n});\n\nvar _compact = __webpack_require__(/*! ./compact */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/compact/index.js\");\n\nObject.keys(_compact).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _compact[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _compact[key];\n    }\n  });\n});\n\nvar _extractTime = __webpack_require__(/*! ./extractTime */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/extractTime.js\");\n\nObject.keys(_extractTime).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _extractTime[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _extractTime[key];\n    }\n  });\n});\n\nvar _format = __webpack_require__(/*! ./format */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/index.js\");\n\nObject.keys(_format).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _format[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _format[key];\n    }\n  });\n});\n\nvar _hex = __webpack_require__(/*! ./hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/index.js\");\n\nObject.keys(_hex).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _hex[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _hex[key];\n    }\n  });\n});\n\nvar _is = __webpack_require__(/*! ./is */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/index.js\");\n\nObject.keys(_is).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _is[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _is[key];\n    }\n  });\n});\n\nvar _logger = __webpack_require__(/*! ./logger */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/logger.js\");\n\nObject.keys(_logger).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _logger[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _logger[key];\n    }\n  });\n});\n\nvar _memoize = __webpack_require__(/*! ./memoize */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/memoize.js\");\n\nObject.keys(_memoize).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _memoize[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _memoize[key];\n    }\n  });\n});\n\nvar _number = __webpack_require__(/*! ./number */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/index.js\");\n\nObject.keys(_number).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _number[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _number[key];\n    }\n  });\n});\n\nvar _promisify = __webpack_require__(/*! ./promisify */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/promisify.js\");\n\nObject.keys(_promisify).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _promisify[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _promisify[key];\n    }\n  });\n});\n\nvar _string = __webpack_require__(/*! ./string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/index.js\");\n\nObject.keys(_string).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _string[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _string[key];\n    }\n  });\n});\n\nvar _u8a = __webpack_require__(/*! ./u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js\");\n\nObject.keys(_u8a).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _u8a[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _u8a[key];\n    }\n  });\n});\n\nvar _versionDetect = __webpack_require__(/*! ./versionDetect */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/versionDetect.js\");\n\nObject.keys(_versionDetect).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;\n  if (key in exports && exports[key] === _versionDetect[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function () {\n      return _versionDetect[key];\n    }\n  });\n});\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ascii.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ascii.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isAscii = isAscii;\n\nvar _toU8a = __webpack_require__(/*! ../u8a/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\nvar _string = __webpack_require__(/*! ./string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst FORMAT = [9, 10, 13];\n/**\n * @name isAscii\n * @summary Tests if the input is printable ASCII\n * @description\n * Checks to see if the input string or Uint8Array is printable ASCII, 32-127 + formatters\n */\n\nfunction isAscii(value) {\n  return value ? !(0, _toU8a.u8aToU8a)(value).some(byte => byte >= 127 || byte < 32 && !FORMAT.includes(byte)) : (0, _string.isString)(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ascii.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isBigInt = isBigInt;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isBigInt\n * @summary Tests for a `BigInt` object instance.\n * @description\n * Checks to see if the input object is an instance of `BigInt`\n * @example\n * <BR>\n *\n * ```javascript\n * import { isBigInt } from '@polkadot/util';\n *\n * console.log('isBigInt', isBigInt(123_456n)); // => true\n * ```\n */\nfunction isBigInt(value) {\n  return typeof value === 'bigint';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bn.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bn.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isBn = isBn;\n\nvar _bn = _interopRequireDefault(__webpack_require__(/*! bn.js */ \"./node_modules/bn.js/lib/bn.js\"));\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isBn\n * @summary Tests for a `BN` object instance.\n * @description\n * Checks to see if the input object is an instance of `BN` (bn.js).\n * @example\n * <BR>\n *\n * ```javascript\n * import BN from 'bn.js';\n * import { isBn } from '@polkadot/util';\n *\n * console.log('isBn', isBn(new BN(1))); // => true\n * ```\n */\nfunction isBn(value) {\n  return _bn.default.isBN(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bn.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isBoolean = isBoolean;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isBoolean\n * @summary Tests for a boolean value.\n * @description\n * Checks to see if the input value is a JavaScript boolean.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isBoolean } from '@polkadot/util';\n *\n * isBoolean(false); // => true\n * ```\n */\nfunction isBoolean(value) {\n  return typeof value === 'boolean';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(Buffer) {\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isBuffer = isBuffer;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isBuffer\n * @summary Tests for a `Buffer` object instance.\n * @description\n * Checks to see if the input object is an instance of `Buffer`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isBuffer } from '@polkadot/util';\n *\n * console.log('isBuffer', isBuffer(Buffer.from([]))); // => true\n * ```\n */\nfunction isBuffer(value) {\n  return Buffer.isBuffer(value);\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/childClass.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/childClass.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isChildClass = isChildClass;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isChildClass\n * @summary Tests if the child extends the parent Class\n * @description\n * Checks to see if the child Class extends the parent Class\n * @example\n * <BR>\n *\n * ```javascript\n * import { isChildClass } from '@polkadot/util';\n *\n * console.log('isChildClass', isChildClass(BN, BN); // => true\n * console.log('isChildClass', isChildClass(BN, Uint8Array); // => false\n * ```\n */\nfunction isChildClass(Parent, Child) {\n  // https://stackoverflow.com/questions/30993434/check-if-a-constructor-inherits-another-in-es6/30993664\n  return Child // eslint-disable-next-line no-prototype-builtins\n  ? Parent === Child || Parent.isPrototypeOf(Child) : false;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/childClass.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/error.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/error.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isError = isError;\n\nvar _instanceOf = __webpack_require__(/*! ./instanceOf */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isError\n * @summary Tests for a `Error` object instance.\n * @description\n * Checks to see if the input object is an instance of `Error`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isError } from '@polkadot/util';\n *\n * console.log('isError', isError(new Error('message'))); // => true\n * ```\n */\nfunction isError(value) {\n  return (0, _instanceOf.isInstanceOf)(value, Error);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/error.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isFunction = isFunction;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// eslint-disable-next-line @typescript-eslint/ban-types\n\n/**\n * @name isFunction\n * @summary Tests for a `function`.\n * @description\n * Checks to see if the input value is a JavaScript function.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isFunction } from '@polkadot/util';\n *\n * isFunction(() => false); // => true\n * ```\n */\nfunction isFunction(value) {\n  return typeof value === 'function';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isHex = isHex;\n\nvar _string = __webpack_require__(/*! ./string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst HEX_REGEX = /^0x[a-fA-F0-9]+$/;\n/**\n * @name isHex\n * @summary Tests for a hex string.\n * @description\n * Checks to see if the input value is a `0x` prefixed hex string. Optionally (`bitLength` !== -1) checks to see if the bitLength is correct.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isHex } from '@polkadot/util';\n *\n * isHex('0x1234'); // => true\n * isHex('0x1234', 8); // => false\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\n\nfunction isHex(value, bitLength = -1, ignoreLength = false) {\n  const isValidHex = value === '0x' || (0, _string.isString)(value) && HEX_REGEX.test(value.toString());\n\n  if (isValidHex && bitLength !== -1) {\n    return value.length === 2 + Math.ceil(bitLength / 4);\n  }\n\n  return isValidHex && (ignoreLength || value.length % 2 === 0);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/index.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"isAscii\", {\n  enumerable: true,\n  get: function () {\n    return _ascii.isAscii;\n  }\n});\nObject.defineProperty(exports, \"isBigInt\", {\n  enumerable: true,\n  get: function () {\n    return _bigInt.isBigInt;\n  }\n});\nObject.defineProperty(exports, \"isBn\", {\n  enumerable: true,\n  get: function () {\n    return _bn.isBn;\n  }\n});\nObject.defineProperty(exports, \"isBuffer\", {\n  enumerable: true,\n  get: function () {\n    return _buffer.isBuffer;\n  }\n});\nObject.defineProperty(exports, \"isBoolean\", {\n  enumerable: true,\n  get: function () {\n    return _boolean.isBoolean;\n  }\n});\nObject.defineProperty(exports, \"isChildClass\", {\n  enumerable: true,\n  get: function () {\n    return _childClass.isChildClass;\n  }\n});\nObject.defineProperty(exports, \"isError\", {\n  enumerable: true,\n  get: function () {\n    return _error.isError;\n  }\n});\nObject.defineProperty(exports, \"isFunction\", {\n  enumerable: true,\n  get: function () {\n    return _function.isFunction;\n  }\n});\nObject.defineProperty(exports, \"isHex\", {\n  enumerable: true,\n  get: function () {\n    return _hex.isHex;\n  }\n});\nObject.defineProperty(exports, \"isInstanceOf\", {\n  enumerable: true,\n  get: function () {\n    return _instanceOf.isInstanceOf;\n  }\n});\nObject.defineProperty(exports, \"isIp\", {\n  enumerable: true,\n  get: function () {\n    return _ip.isIp;\n  }\n});\nObject.defineProperty(exports, \"isJsonObject\", {\n  enumerable: true,\n  get: function () {\n    return _jsonObject.isJsonObject;\n  }\n});\nObject.defineProperty(exports, \"isNull\", {\n  enumerable: true,\n  get: function () {\n    return _null.isNull;\n  }\n});\nObject.defineProperty(exports, \"isNumber\", {\n  enumerable: true,\n  get: function () {\n    return _number.isNumber;\n  }\n});\nObject.defineProperty(exports, \"isObject\", {\n  enumerable: true,\n  get: function () {\n    return _object.isObject;\n  }\n});\nObject.defineProperty(exports, \"isObservable\", {\n  enumerable: true,\n  get: function () {\n    return _observable.isObservable;\n  }\n});\nObject.defineProperty(exports, \"isString\", {\n  enumerable: true,\n  get: function () {\n    return _string.isString;\n  }\n});\nObject.defineProperty(exports, \"isTestChain\", {\n  enumerable: true,\n  get: function () {\n    return _testChain.isTestChain;\n  }\n});\nObject.defineProperty(exports, \"isToBn\", {\n  enumerable: true,\n  get: function () {\n    return _toBn.isToBn;\n  }\n});\nObject.defineProperty(exports, \"isU8a\", {\n  enumerable: true,\n  get: function () {\n    return _u8a.isU8a;\n  }\n});\nObject.defineProperty(exports, \"isUndefined\", {\n  enumerable: true,\n  get: function () {\n    return _undefined.isUndefined;\n  }\n});\nObject.defineProperty(exports, \"isUtf8\", {\n  enumerable: true,\n  get: function () {\n    return _utf.isUtf8;\n  }\n});\nObject.defineProperty(exports, \"isWasm\", {\n  enumerable: true,\n  get: function () {\n    return _wasm.isWasm;\n  }\n});\n\nvar _ascii = __webpack_require__(/*! ./ascii */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ascii.js\");\n\nvar _bigInt = __webpack_require__(/*! ./bigInt */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js\");\n\nvar _bn = __webpack_require__(/*! ./bn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bn.js\");\n\nvar _buffer = __webpack_require__(/*! ./buffer */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js\");\n\nvar _boolean = __webpack_require__(/*! ./boolean */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/boolean.js\");\n\nvar _childClass = __webpack_require__(/*! ./childClass */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/childClass.js\");\n\nvar _error = __webpack_require__(/*! ./error */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/error.js\");\n\nvar _function = __webpack_require__(/*! ./function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\nvar _hex = __webpack_require__(/*! ./hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js\");\n\nvar _instanceOf = __webpack_require__(/*! ./instanceOf */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js\");\n\nvar _ip = __webpack_require__(/*! ./ip */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ip.js\");\n\nvar _jsonObject = __webpack_require__(/*! ./jsonObject */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/jsonObject.js\");\n\nvar _null = __webpack_require__(/*! ./null */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js\");\n\nvar _number = __webpack_require__(/*! ./number */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js\");\n\nvar _object = __webpack_require__(/*! ./object */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js\");\n\nvar _observable = __webpack_require__(/*! ./observable */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/observable.js\");\n\nvar _string = __webpack_require__(/*! ./string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\nvar _testChain = __webpack_require__(/*! ./testChain */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/testChain.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/toBn.js\");\n\nvar _u8a = __webpack_require__(/*! ./u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/u8a.js\");\n\nvar _undefined = __webpack_require__(/*! ./undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\nvar _utf = __webpack_require__(/*! ./utf8 */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/utf8.js\");\n\nvar _wasm = __webpack_require__(/*! ./wasm */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/wasm.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isInstanceOf = isInstanceOf;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isInstanceOf\n * @summary Tests for a instance of a class.\n * @description\n * Checks to see if the input value is an instance of the test class.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isInstanceOf } from '@polkadot/util';\n *\n * console.log('isInstanceOf', isInstanceOf(new Array(0), Array)); // => true\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction isInstanceOf(value, clazz) {\n  return value instanceof clazz;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ip.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ip.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isIp = isIp;\n\nvar _ipRegex = _interopRequireDefault(__webpack_require__(/*! ip-regex */ \"./node_modules/ip-regex/index.js\"));\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isIp\n * @summary Tests if the value is a valid IP address\n * @description\n * Checks to see if the value is a valid IP address. Optionally check for either v4/v6\n * @example\n * <BR>\n *\n * ```javascript\n * import { isIp } from '@polkadot/util';\n *\n * isIp('192.168.0.1')); // => true\n * isIp('1:2:3:4:5:6:7:8'); // => true\n * isIp('192.168.0.1', 'v6')); // => false\n * isIp('1:2:3:4:5:6:7:8', 'v4'); // => false\n * ```\n */\nfunction isIp(value, type) {\n  if (type === 'v4') {\n    return _ipRegex.default.v4({\n      exact: true\n    }).test(value);\n  } else if (type === 'v6') {\n    return _ipRegex.default.v6({\n      exact: true\n    }).test(value);\n  }\n\n  return (0, _ipRegex.default)({\n    exact: true\n  }).test(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/ip.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/jsonObject.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/jsonObject.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isJsonObject = isJsonObject;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isJsonObject\n * @summary Tests for a valid JSON `object`.\n * @description\n * Checks to see if the input value is a valid JSON object.\n * It returns false if the input is JSON parsable, but not an Javascript object.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isJsonObject } from '@polkadot/util';\n *\n * isJsonObject({}); // => true\n * isJsonObject({\n *  \"Test\": \"1234\",\n *  \"NestedTest\": {\n *   \"Test\": \"5678\"\n *  }\n * }); // => true\n * isJsonObject(1234); // JSON parsable, but not an object =>  false\n * isJsonObject(null); // JSON parsable, but not an object => false\n * isJsonObject('not an object'); // => false\n * ```\n */\nfunction isJsonObject(value) {\n  const str = typeof value !== 'string' ? JSON.stringify(value) : value;\n\n  try {\n    const obj = JSON.parse(str);\n    return typeof obj === 'object' && obj !== null;\n  } catch (e) {\n    return false;\n  }\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/jsonObject.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isNull = isNull;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isNull\n * @summary Tests for a `null` values.\n * @description\n * Checks to see if the input value is `null`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isNull } from '@polkadot/util';\n *\n * console.log('isNull', isNull(null)); // => true\n * ```\n */\nfunction isNull(value) {\n  return value === null;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isNumber = isNumber;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isNumber\n * @summary Tests for a JavaScript number.\n * @description\n * Checks to see if the input value is a valid number.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isNumber } from '@polkadot/util';\n *\n * console.log('isNumber', isNumber(1234)); // => true\n * ```\n */\nfunction isNumber(value) {\n  return typeof value === 'number';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/number.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isObject = isObject;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isObject\n * @summary Tests for an `object`.\n * @description\n * Checks to see if the input value is a JavaScript object.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isObject } from '@polkadot/util';\n *\n * isObject({}); // => true\n * isObject('something'); // => false\n * ```\n */\nfunction isObject(value) {\n  return typeof value === 'object';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/observable.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/observable.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isObservable = isObservable;\n\nvar _function = __webpack_require__(/*! ./function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\nvar _object = __webpack_require__(/*! ./object */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isBObservable\n * @summary Tests for a `Observable` object instance.\n * @description\n * Checks to see if the input object is an instance of `BN` (bn.js).\n * @example\n * <BR>\n *\n * ```javascript\n * import { isObservable } from '@polkadot/util';\n *\n * console.log('isObservable', isObservable(...));\n * ```\n */\nfunction isObservable(value) {\n  return (0, _object.isObject)(value) && (0, _function.isFunction)(value.next);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/observable.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isString = isString;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isString\n * @summary Tests for a string.\n * @description\n * Checks to see if the input value is a JavaScript string.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isString } from '@polkadot/util';\n *\n * console.log('isString', isString('test')); // => true\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction isString(value) {\n  return typeof value === 'string' || value instanceof String;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/testChain.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/testChain.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isTestChain = isTestChain;\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst re = /(Development|Local Testnet)$/;\n\nfunction isTestChain(chain) {\n  if (!chain) {\n    return false;\n  }\n\n  return !!re.test(chain.toString());\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/testChain.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/toBn.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/toBn.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isToBn = isToBn;\n\nvar _function = __webpack_require__(/*! ./function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction isToBn(value) {\n  return !!value && (0, _function.isFunction)(value.toBn);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/toBn.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/u8a.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/u8a.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isU8a = isU8a;\n\nvar _instanceOf = __webpack_require__(/*! ./instanceOf */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/instanceOf.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isU8a\n * @summary Tests for a `Uint8Array` object instance.\n * @description\n * Checks to see if the input object is an instance of `Uint8Array`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isUint8Array } from '@polkadot/util';\n *\n * console.log('isU8a', isU8a([])); // => false\n * ```\n */\nfunction isU8a(value) {\n  return (0, _instanceOf.isInstanceOf)(value, Uint8Array);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/u8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isUndefined = isUndefined;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name isUndefined\n * @summary Tests for a `undefined` values.\n * @description\n * Checks to see if the input value is `undefined`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { isUndefined } from '@polkadot/util';\n *\n * console.log('isUndefined', isUndefined(void(0))); // => true\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction isUndefined(value) {\n  return typeof value === 'undefined';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/utf8.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/utf8.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isUtf8 = isUtf8;\n\nvar _toU8a = __webpack_require__(/*! ../u8a/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\nvar _string = __webpack_require__(/*! ./string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// Adapted from https://github.com/JulienPalard/is_utf8/blob/master/is_utf8.c\n\n/**\n * @name isUtf8\n * @summary Tests if the input is valid Utf8\n * @description\n * Checks to see if the input string or Uint8Array is valid Utf8\n */\nfunction isUtf8(value) {\n  if (!value) {\n    return (0, _string.isString)(value);\n  }\n\n  const u8a = (0, _toU8a.u8aToU8a)(value);\n  const len = u8a.length;\n  let i = 0;\n\n  while (i < len) {\n    if (u8a[i] <= 0x7F)\n      /* 00..7F */\n      {\n        i += 1;\n      } else if (u8a[i] >= 0xC2 && u8a[i] <= 0xDF)\n      /* C2..DF 80..BF */\n      {\n        if (i + 1 < len)\n          /* Expect a 2nd byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte between C2 and DF, expecting a 2nd byte between 80 and BF\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte between C2 and DF, expecting a 2nd byte.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 2;\n      } else if (u8a[i] === 0xE0)\n      /* E0 A0..BF 80..BF */\n      {\n        if (i + 2 < len)\n          /* Expect a 2nd and 3rd byte */\n          {\n            if (u8a[i + 1] < 0xA0 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte of E0, expecting a 2nd byte between A0 and BF.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte of E0, expecting a 3nd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte of E0, expecting two following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 3;\n      } else if (u8a[i] >= 0xE1 && u8a[i] <= 0xEC)\n      /* E1..EC 80..BF 80..BF */\n      {\n        if (i + 2 < len)\n          /* Expect a 2nd and 3rd byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte between E1 and EC, expecting the 2nd byte between 80 and BF.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte between E1 and EC, expecting the 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte between E1 and EC, expecting two following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 3;\n      } else if (u8a[i] === 0xED)\n      /* ED 80..9F 80..BF */\n      {\n        if (i + 2 < len)\n          /* Expect a 2nd and 3rd byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0x9F) {\n              // *message = \"After a first byte of ED, expecting 2nd byte between 80 and 9F.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte of ED, expecting 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte of ED, expecting two following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 3;\n      } else if (u8a[i] >= 0xEE && u8a[i] <= 0xEF)\n      /* EE..EF 80..BF 80..BF */\n      {\n        if (i + 2 < len)\n          /* Expect a 2nd and 3rd byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte between EE and EF, expecting 2nd byte between 80 and BF.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte between EE and EF, expecting 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte between EE and EF, two following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 3;\n      } else if (u8a[i] === 0xF0)\n      /* F0 90..BF 80..BF 80..BF */\n      {\n        if (i + 3 < len)\n          /* Expect a 2nd, 3rd 3th byte */\n          {\n            if (u8a[i + 1] < 0x90 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte of F0, expecting 2nd byte between 90 and BF.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte of F0, expecting 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n\n            if (u8a[i + 3] < 0x80 || u8a[i + 3] > 0xBF) {\n              // *message = \"After a first byte of F0, expecting 4th byte between 80 and BF.\";\n              // *faulty_bytes = 4;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte of F0, expecting three following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 4;\n      } else if (u8a[i] >= 0xF1 && u8a[i] <= 0xF3)\n      /* F1..F3 80..BF 80..BF 80..BF */\n      {\n        if (i + 3 < len)\n          /* Expect a 2nd, 3rd 3th byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0xBF) {\n              // *message = \"After a first byte of F1, F2, or F3, expecting a 2nd byte between 80 and BF.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte of F1, F2, or F3, expecting a 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n\n            if (u8a[i + 3] < 0x80 || u8a[i + 3] > 0xBF) {\n              // *message = \"After a first byte of F1, F2, or F3, expecting a 4th byte between 80 and BF.\";\n              // *faulty_bytes = 4;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte of F1, F2, or F3, expecting three following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 4;\n      } else if (u8a[i] === 0xF4)\n      /* F4 80..8F 80..BF 80..BF */\n      {\n        if (i + 3 < len)\n          /* Expect a 2nd, 3rd 3th byte */\n          {\n            if (u8a[i + 1] < 0x80 || u8a[i + 1] > 0x8F) {\n              // *message = \"After a first byte of F4, expecting 2nd byte between 80 and 8F.\";\n              // *faulty_bytes = 2;\n              return false;\n            }\n\n            if (u8a[i + 2] < 0x80 || u8a[i + 2] > 0xBF) {\n              // *message = \"After a first byte of F4, expecting 3rd byte between 80 and BF.\";\n              // *faulty_bytes = 3;\n              return false;\n            }\n\n            if (u8a[i + 3] < 0x80 || u8a[i + 3] > 0xBF) {\n              // *message = \"After a first byte of F4, expecting 4th byte between 80 and BF.\";\n              // *faulty_bytes = 4;\n              return false;\n            }\n          } else {\n          // *message = \"After a first byte of F4, expecting three following bytes.\";\n          // *faulty_bytes = 1;\n          return false;\n        }\n\n        i += 4;\n      } else {\n      // *message = \"Expecting bytes in the following ranges: 00..7F C2..F4.\";\n      // *faulty_bytes = 1;\n      return false;\n    }\n  }\n\n  return true;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/utf8.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/wasm.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/wasm.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.isWasm = isWasm;\n\nvar _eq = __webpack_require__(/*! ../u8a/eq */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/eq.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst WASM_MAGIC = new Uint8Array([0, 97, 115, 109]); // \\0asm\n\n/**\n * @name isWasm\n * @summary Tests if the input has a WASM header\n * @description\n * Checks to see if the input Uint8Array contains a valid WASM header\n */\n\nfunction isWasm(value) {\n  return !!value && (0, _eq.u8aEq)(value.subarray(0, 4), WASM_MAGIC);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/wasm.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/logger.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/logger.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(process) {\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.loggerFormat = loggerFormat;\nexports.logger = logger;\n\nvar _formatDate = __webpack_require__(/*! ./format/formatDate */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/format/formatDate.js\");\n\nvar _bn = __webpack_require__(/*! ./is/bn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bn.js\");\n\nvar _buffer = __webpack_require__(/*! ./is/buffer */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js\");\n\nvar _function = __webpack_require__(/*! ./is/function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\nvar _object = __webpack_require__(/*! ./is/object */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/object.js\");\n\nvar _u8a = __webpack_require__(/*! ./is/u8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/u8a.js\");\n\nvar _toHex = __webpack_require__(/*! ./u8a/toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js\");\n\nvar _toU8a = __webpack_require__(/*! ./u8a/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst logTo = {\n  debug: 'log',\n  error: 'error',\n  log: 'log',\n  warn: 'warn'\n};\n\nfunction formatOther(value) {\n  if (value && (0, _object.isObject)(value) && value.constructor === Object) {\n    return Object.keys(value).reduce((result, key) => {\n      result[key] = loggerFormat(value[key]);\n      return result;\n    }, {});\n  }\n\n  return value;\n}\n\nfunction loggerFormat(value) {\n  if (Array.isArray(value)) {\n    return value.map(loggerFormat);\n  } else if ((0, _bn.isBn)(value)) {\n    return value.toString();\n  } else if ((0, _u8a.isU8a)(value) || (0, _buffer.isBuffer)(value)) {\n    return (0, _toHex.u8aToHex)((0, _toU8a.u8aToU8a)(value));\n  }\n\n  return formatOther(value);\n}\n\nfunction apply(log, type, values, maxSize = -1) {\n  if (values.length === 1 && (0, _function.isFunction)(values[0])) {\n    const fnResult = values[0]();\n    return apply(log, type, Array.isArray(fnResult) ? fnResult : [fnResult], maxSize);\n  }\n\n  console[logTo[log]]((0, _formatDate.formatDate)(new Date()), type, ...values.map(loggerFormat).map(v => {\n    if (maxSize <= 0) {\n      return v;\n    }\n\n    const r = `${v}`;\n    return r.length < maxSize ? v : `${r.substr(0, maxSize)} ...`;\n  }));\n}\n\nfunction noop() {// noop\n}\n\nfunction parseEnv(type) {\n  var _process, _process$env, _process2, _process2$env;\n\n  const maxSize = parseInt(((_process = process) === null || _process === void 0 ? void 0 : (_process$env = _process.env) === null || _process$env === void 0 ? void 0 : _process$env.DEBUG_MAX) || '-1', 10);\n  return [(((_process2 = process) === null || _process2 === void 0 ? void 0 : (_process2$env = _process2.env) === null || _process2$env === void 0 ? void 0 : _process2$env.DEBUG) || '').toLowerCase().split(',').some(e => !!e && (e === '*' || type.startsWith(e))), isNaN(maxSize) ? -1 : maxSize];\n}\n/**\n * @name Logger\n * @summary Creates a consistent log interface for messages\n * @description\n * Returns a `Logger` that has `.log`, `.error`, `.warn` and `.debug` (controlled with environment `DEBUG=typeA,typeB`) methods. Logging is done with a consistent prefix (type of logger, date) followed by the actual message using the underlying console.\n * @example\n * <BR>\n *\n * ```javascript\n * import { logger } from '@polkadot';\n *\n * const l = logger('test');\n * ```\n */\n\n\nfunction logger(_type) {\n  const type = `${_type.toUpperCase()}:`.padStart(16);\n  const [isDebug, maxSize] = parseEnv(_type.toLowerCase());\n  return {\n    debug: isDebug ? (...values) => apply('debug', type, values, maxSize) : noop,\n    error: (...values) => apply('error', type, values),\n    log: (...values) => apply('log', type, values),\n    noop,\n    warn: (...values) => apply('warn', type, values)\n  };\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../process/browser.js */ \"./node_modules/process/browser.js\")))\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/logger.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/memoize.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/memoize.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.memoize = memoize;\n\nvar _bigInt = __webpack_require__(/*! ./is/bigInt */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/bigInt.js\");\n\nvar _undefined = __webpack_require__(/*! ./is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction defaultGetId() {\n  return 'none';\n}\n\nfunction normalize(args) {\n  return JSON.stringify(args, (_, value) => (0, _bigInt.isBigInt)(value) ? value.toString() : value);\n} // eslint-disable-next-line @typescript-eslint/no-explicit-any\n\n\nfunction memoize(fn, {\n  getInstanceId = defaultGetId\n} = {}) {\n  const cache = {};\n\n  const memoized = (...args) => {\n    const stringParams = normalize(args);\n    const instanceId = getInstanceId();\n\n    if (!cache[instanceId]) {\n      cache[instanceId] = {};\n    }\n\n    if ((0, _undefined.isUndefined)(cache[instanceId][stringParams])) {\n      cache[instanceId][stringParams] = fn(...args);\n    }\n\n    return cache[instanceId][stringParams];\n  };\n\n  memoized.unmemoize = (...args) => {\n    const stringParams = normalize(args);\n    const instanceId = getInstanceId();\n\n    if (cache[instanceId] && !(0, _undefined.isUndefined)(cache[instanceId][stringParams])) {\n      delete cache[instanceId][stringParams];\n    }\n  };\n\n  return memoized;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/memoize.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"numberToHex\", {\n  enumerable: true,\n  get: function () {\n    return _toHex.numberToHex;\n  }\n});\nObject.defineProperty(exports, \"numberToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.numberToU8a;\n  }\n});\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toHex.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toHex.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toHex.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.numberToHex = numberToHex;\n\nvar _fixLength = __webpack_require__(/*! ../hex/fixLength */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/fixLength.js\");\n\nvar _null = __webpack_require__(/*! ../is/null */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js\");\n\nvar _undefined = __webpack_require__(/*! ../is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name numberToHex\n * @summary Creates a hex value from a number.\n * @description\n * `null`/`undefined`/`NaN` inputs returns an empty `0x` result. `number` input values return the actual bytes value converted to a `hex`. With `bitLength` set, it converts the number to the equivalent size.\n * @example\n * <BR>\n *\n * ```javascript\n * import { numberToHex } from '@polkadot/util';\n *\n * numberToHex(0x1234); // => '0x1234'\n * numberToHex(0x1234, 32); // => 0x00001234\n * ```\n */\nfunction numberToHex(value, bitLength = -1) {\n  if ((0, _undefined.isUndefined)(value) || (0, _null.isNull)(value) || isNaN(value)) {\n    return '0x';\n  }\n\n  return (0, _fixLength.hexFixLength)(value.toString(16), bitLength, true);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toHex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toU8a.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toU8a.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.numberToU8a = numberToU8a;\n\nvar _toU8a = __webpack_require__(/*! ../hex/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js\");\n\nvar _null = __webpack_require__(/*! ../is/null */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/null.js\");\n\nvar _undefined = __webpack_require__(/*! ../is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toHex.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name numberToU8a\n * @summary Creates a Uint8Array object from a number.\n * @description\n * `null`/`undefined`/`NaN` inputs returns an empty `Uint8Array` result. `number` input values return the actual bytes value converted to a `Uint8Array`. With `bitLength`, it converts the value to the equivalent size.\n * @example\n * <BR>\n *\n * ```javascript\n * import { numberToU8a } from '@polkadot/util';\n *\n * numberToU8a(0x1234); // => [0x12, 0x34]\n * ```\n */\nfunction numberToU8a(value, bitLength = -1) {\n  if ((0, _undefined.isUndefined)(value) || (0, _null.isNull)(value) || isNaN(value)) {\n    return new Uint8Array();\n  }\n\n  return (0, _toU8a.hexToU8a)((0, _toHex.numberToHex)(value, bitLength));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/number/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/packageInfo.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/packageInfo.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.packageInfo = void 0;\n// Copyright 2017-2021 @polkadot/dev authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// Auto-generated by @polkadot/dev, do not edit\nconst packageInfo = {\n  name: '@polkadot/util',\n  version: '5.9.2'\n};\nexports.packageInfo = packageInfo;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/packageInfo.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/promisify.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/promisify.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.promisify = promisify;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name promisify\n * @summary Wraps an async callback into a `Promise`\n * @description\n * Wraps the supplied async function `fn` that has a standard JS callback `(error: Error, result: any)` into a `Promise`, passing the supplied parameters. When `error` is set, the Promise is rejected, else the Promise resolves with the `result` value.\n * @example\n * <BR>\n *\n * ```javascript\n * const { promisify } from '@polkadot/util';\n *\n * await promisify(null, ((a, cb) => cb(null, a), true); // resolves with `true`\n * await promisify(null, (cb) => cb(new Error('error!'))); // rejects with `error!`\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/no-explicit-any\nfunction promisify(self, fn, ...params) {\n  return new Promise((resolve, reject) => {\n    const handler = (error, result) => {\n      if (error) {\n        reject(error);\n      } else {\n        resolve(result);\n      }\n    };\n\n    fn.apply(self, params.concat(handler));\n  });\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/promisify.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/camelCase.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/camelCase.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringCamelCase = stringCamelCase;\n\nvar _camelcase = _interopRequireDefault(__webpack_require__(/*! camelcase */ \"./node_modules/camelcase/index.js\"));\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name stringCamelCase\n * @summary Convert a dash/dot/underscore/space separated string/String to camelCase\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction stringCamelCase(value) {\n  return (0, _camelcase.default)(value.toString());\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/camelCase.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"stringCamelCase\", {\n  enumerable: true,\n  get: function () {\n    return _camelCase.stringCamelCase;\n  }\n});\nObject.defineProperty(exports, \"stringLowerFirst\", {\n  enumerable: true,\n  get: function () {\n    return _lowerFirst.stringLowerFirst;\n  }\n});\nObject.defineProperty(exports, \"stringShorten\", {\n  enumerable: true,\n  get: function () {\n    return _shorten.stringShorten;\n  }\n});\nObject.defineProperty(exports, \"stringToHex\", {\n  enumerable: true,\n  get: function () {\n    return _toHex.stringToHex;\n  }\n});\nObject.defineProperty(exports, \"stringToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.stringToU8a;\n  }\n});\nObject.defineProperty(exports, \"stringUpperFirst\", {\n  enumerable: true,\n  get: function () {\n    return _upperFirst.stringUpperFirst;\n  }\n});\n\nvar _camelCase = __webpack_require__(/*! ./camelCase */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/camelCase.js\");\n\nvar _lowerFirst = __webpack_require__(/*! ./lowerFirst */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/lowerFirst.js\");\n\nvar _shorten = __webpack_require__(/*! ./shorten */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/shorten.js\");\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toHex.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js\");\n\nvar _upperFirst = __webpack_require__(/*! ./upperFirst */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/upperFirst.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/lowerFirst.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/lowerFirst.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringLowerFirst = stringLowerFirst;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name stringLowerFirst\n * @summary Lowercase the first letter of a string\n * @description\n * Lowercase the first letter of a string\n * @example\n * <BR>\n *\n * ```javascript\n * import { stringLowerFirst } from '@polkadot/util';\n *\n * stringLowerFirst('ABC'); // => 'aBC'\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction stringLowerFirst(value) {\n  return value ? value.charAt(0).toLowerCase() + value.slice(1) : '';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/lowerFirst.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/shorten.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/shorten.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringShorten = stringShorten;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name stringShorten\n * @summary Returns a string with maximum length\n * @description\n * Checks the string against the `prefixLength`, if longer than double this, shortens it by placing `..` in the middle of it\n * @example\n * <BR>\n *\n * ```javascript\n * import { stringShorten } from '@polkadot/util';\n *\n * stringShorten('1234567890', 2); // => 12..90\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction stringShorten(value, prefixLength = 6) {\n  if (value.length <= 2 + 2 * prefixLength) {\n    return value.toString();\n  }\n\n  return `${value.substr(0, prefixLength)}…${value.slice(-prefixLength)}`;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/shorten.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toHex.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toHex.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringToHex = stringToHex;\n\nvar _toHex = __webpack_require__(/*! ../u8a/toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name stringToHex\n * @summary Creates a hex string from a utf-8 string\n * @description\n * String input values return the actual encoded hex value.\n * @example\n * <BR>\n *\n * ```javascript\n * import { stringToHex } from '@polkadot/util';\n *\n * stringToU8a('hello'); // 0x68656c6c6f\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction stringToHex(value) {\n  return (0, _toHex.u8aToHex)((0, _toU8a.stringToU8a)(value));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toHex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringToU8a = stringToU8a;\n\nvar _xTextencoder = __webpack_require__(/*! @polkadot/x-textencoder */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/browser.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst encoder = new _xTextencoder.TextEncoder();\n/**\n * @name stringToU8a\n * @summary Creates a Uint8Array object from a utf-8 string.\n * @description\n * String input values return the actual encoded `UInt8Array`. `null` or `undefined` values returns an empty encoded array.\n * @example\n * <BR>\n *\n * ```javascript\n * import { stringToU8a } from '@polkadot/util';\n *\n * stringToU8a('hello'); // [0x68, 0x65, 0x6c, 0x6c, 0x6f]\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\n\nfunction stringToU8a(value) {\n  return value ? encoder.encode(value.toString()) : new Uint8Array();\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/upperFirst.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/upperFirst.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.stringUpperFirst = stringUpperFirst;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name stringUpperFirst\n * @summary Lowercase the first letter of a string\n * @description\n * Lowercase the first letter of a string\n * @example\n * <BR>\n *\n * ```javascript\n * import { stringUpperFirst } from '@polkadot/util';\n *\n * stringUpperFirst('abc'); // => 'Abc'\n * ```\n */\n// eslint-disable-next-line @typescript-eslint/ban-types\nfunction stringUpperFirst(value) {\n  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/upperFirst.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/concat.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/concat.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aConcat = u8aConcat;\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name u8aConcat\n * @summary Creates a concatenated Uint8Array from the inputs.\n * @description\n * Concatenates the input arrays into a single `UInt8Array`.\n * @example\n * <BR>\n *\n * ```javascript\n * import { { u8aConcat } from '@polkadot/util';\n *\n * u8aConcat(\n *   new Uint8Array([1, 2, 3]),\n *   new Uint8Array([4, 5, 6])\n * ); // [1, 2, 3, 4, 5, 6]\n * ```\n */\nfunction u8aConcat(...list) {\n  let length = 0;\n  let offset = 0;\n  const u8as = new Array(list.length);\n\n  for (let i = 0; i < list.length; i++) {\n    u8as[i] = (0, _toU8a.u8aToU8a)(list[i]);\n    length += u8as[i].length;\n  }\n\n  const result = new Uint8Array(length);\n\n  for (let i = 0; i < u8as.length; i++) {\n    result.set(u8as[i], offset);\n    offset += u8as[i].length;\n  }\n\n  return result;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/concat.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/eq.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/eq.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aEq = u8aEq;\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction equals(a, b) {\n  if (a.length !== b.length) {\n    return false;\n  }\n\n  for (let i = 0; i < a.length; i++) {\n    if (a[i] !== b[i]) {\n      return false;\n    }\n  }\n\n  return true;\n}\n/**\n * @name u8aEq\n * @summary Compares two Uint8Arrays.\n * @description\n * For `UInt8Array` (or hex string) input values true if there is a match.\n * @example\n * <BR>\n *\n * ```javascript\n * import { { u8aEq } from '@polkadot/util';\n *\n * u8aEq(new Uint8Array([0x68, 0x65]), new Uint8Array([0x68, 0x65])); // true\n * ```\n */\n\n\nfunction u8aEq(a, b) {\n  return equals((0, _toU8a.u8aToU8a)(a), (0, _toU8a.u8aToU8a)(b));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/eq.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/fixLength.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/fixLength.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aFixLength = u8aFixLength;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name u8aFixLength\n * @summary Shifts a Uint8Array to a specific bitLength\n * @description\n * Returns a uint8Array with the specified number of bits contained in the return value. (If bitLength is -1, length checking is not done). Values with more bits are trimmed to the specified length.\n * @example\n * <BR>\n *\n * ```javascript\n * import { u8aFixLength } from '@polkadot/util';\n *\n * u8aFixLength('0x12') // => 0x12\n * u8aFixLength('0x12', 16) // => 0x0012\n * u8aFixLength('0x1234', 8) // => 0x12\n * ```\n */\nfunction u8aFixLength(value, bitLength = -1, atStart = false) {\n  const byteLength = Math.ceil(bitLength / 8);\n\n  if (bitLength === -1 || value.length === byteLength) {\n    return value;\n  } else if (value.length > byteLength) {\n    return value.subarray(0, byteLength);\n  }\n\n  const result = new Uint8Array(byteLength);\n\n  if (atStart) {\n    result.set(value, 0);\n  } else {\n    result.set(value, byteLength - value.length);\n  }\n\n  return result;\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/fixLength.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"u8aConcat\", {\n  enumerable: true,\n  get: function () {\n    return _concat.u8aConcat;\n  }\n});\nObject.defineProperty(exports, \"u8aEq\", {\n  enumerable: true,\n  get: function () {\n    return _eq.u8aEq;\n  }\n});\nObject.defineProperty(exports, \"u8aFixLength\", {\n  enumerable: true,\n  get: function () {\n    return _fixLength.u8aFixLength;\n  }\n});\nObject.defineProperty(exports, \"u8aSorted\", {\n  enumerable: true,\n  get: function () {\n    return _sorted.u8aSorted;\n  }\n});\nObject.defineProperty(exports, \"u8aToBn\", {\n  enumerable: true,\n  get: function () {\n    return _toBn.u8aToBn;\n  }\n});\nObject.defineProperty(exports, \"u8aToBuffer\", {\n  enumerable: true,\n  get: function () {\n    return _toBuffer.u8aToBuffer;\n  }\n});\nObject.defineProperty(exports, \"u8aToHex\", {\n  enumerable: true,\n  get: function () {\n    return _toHex.u8aToHex;\n  }\n});\nObject.defineProperty(exports, \"u8aToString\", {\n  enumerable: true,\n  get: function () {\n    return _toString.u8aToString;\n  }\n});\nObject.defineProperty(exports, \"u8aToU8a\", {\n  enumerable: true,\n  get: function () {\n    return _toU8a.u8aToU8a;\n  }\n});\n\nvar _concat = __webpack_require__(/*! ./concat */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/concat.js\");\n\nvar _eq = __webpack_require__(/*! ./eq */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/eq.js\");\n\nvar _fixLength = __webpack_require__(/*! ./fixLength */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/fixLength.js\");\n\nvar _sorted = __webpack_require__(/*! ./sorted */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/sorted.js\");\n\nvar _toBn = __webpack_require__(/*! ./toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBn.js\");\n\nvar _toBuffer = __webpack_require__(/*! ./toBuffer */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBuffer.js\");\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js\");\n\nvar _toString = __webpack_require__(/*! ./toString */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toString.js\");\n\nvar _toU8a = __webpack_require__(/*! ./toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js\");\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/sorted.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/sorted.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aSorted = u8aSorted;\n\nvar _undefined = __webpack_require__(/*! ../is/undefined */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/undefined.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction u8aSorted(u8as) {\n  return u8as.sort((a, b) => {\n    let i = 0;\n\n    while (true) {\n      if ((0, _undefined.isUndefined)(a[i]) && (0, _undefined.isUndefined)(b[i])) {\n        return 0;\n      } else if ((0, _undefined.isUndefined)(a[i])) {\n        return -1;\n      } else if ((0, _undefined.isUndefined)(b[i])) {\n        return 1;\n      }\n\n      const cmp = a[i] - b[i];\n\n      if (cmp !== 0) {\n        return cmp;\n      }\n\n      i++;\n    }\n  });\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/sorted.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBn.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBn.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aToBn = u8aToBn;\n\nvar _toBn = __webpack_require__(/*! ../hex/toBn */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toBn.js\");\n\nvar _toHex = __webpack_require__(/*! ./toHex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name u8aToBn\n * @summary Creates a BN from a Uint8Array object.\n * @description\n * `UInt8Array` input values return the actual BN. `null` or `undefined` values returns an `0x0` value.\n * @param value The value to convert\n * @param options Options to pass while converting\n * @param options.isLe Convert using Little Endian\n * @param options.isNegative Convert using two's complement\n * @example\n * <BR>\n *\n * ```javascript\n * import { u8aToBn } from '@polkadot/util';\n *\n * u8aToHex(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0xf])); // 0x68656c0f\n * ```\n */\nfunction u8aToBn(value, options = {\n  isLe: true,\n  isNegative: false\n}) {\n  return (0, _toBn.hexToBn)((0, _toHex.u8aToHex)(value), options);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBn.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBuffer.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBuffer.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(Buffer) {\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aToBuffer = u8aToBuffer;\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n/**\n * @name u8aToBuffer\n * @summary Creates a Buffer object from a hex string.\n * @description\n * `null` inputs returns an empty `Buffer` result. `UInt8Array` input values return the actual bytes value converted to a `Buffer`. Anything that is not a `UInt8Array` throws an error.\n * @example\n * <BR>\n *\n * ```javascript\n * import { u8aToBuffer } from '@polkadot/util';\n *\n * console.log('Buffer', u8aToBuffer('0x123480001f'));\n * ```\n */\nfunction u8aToBuffer(value) {\n  return !value ? Buffer.from([]) : Buffer.from(value);\n}\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../node-libs-browser/node_modules/buffer/index.js */ \"./node_modules/node-libs-browser/node_modules/buffer/index.js\").Buffer))\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toBuffer.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aToHex = u8aToHex;\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst ALPHABET = new Array(256).fill(0).map((_, n) => n.toString(16).padStart(2, '0'));\n/** @internal */\n\nfunction extract(value) {\n  const result = new Array(value.length);\n\n  for (let i = 0; i < value.length; i++) {\n    result[i] = ALPHABET[value[i]];\n  }\n\n  return result.join('');\n}\n/** @internal */\n\n\nfunction trim(value, halfLength) {\n  return `${u8aToHex(value.subarray(0, halfLength), -1, false)}…${u8aToHex(value.subarray(value.length - halfLength), -1, false)}`;\n}\n/**\n * @name u8aToHex\n * @summary Creates a hex string from a Uint8Array object.\n * @description\n * `UInt8Array` input values return the actual hex string. `null` or `undefined` values returns an `0x` string.\n * @example\n * <BR>\n *\n * ```javascript\n * import { u8aToHex } from '@polkadot/util';\n *\n * u8aToHex(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0xf])); // 0x68656c0f\n * ```\n */\n\n\nfunction u8aToHex(value, bitLength = -1, isPrefixed = true) {\n  const prefix = isPrefixed ? '0x' : '';\n\n  if (!(value !== null && value !== void 0 && value.length)) {\n    return prefix;\n  }\n\n  const byteLength = Math.ceil(bitLength / 8);\n  return prefix + (byteLength > 0 && value.length > byteLength ? trim(value, Math.ceil(byteLength / 2)) : extract(value));\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toHex.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toString.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toString.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aToString = u8aToString;\n\nvar _xTextdecoder = __webpack_require__(/*! @polkadot/x-textdecoder */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/browser.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst decoder = new _xTextdecoder.TextDecoder('utf-8');\n/**\n * @name u8aToString\n * @summary Creates a utf-8 string from a Uint8Array object.\n * @description\n * `UInt8Array` input values return the actual decoded utf-8 string. `null` or `undefined` values returns an empty string.\n * @example\n * <BR>\n *\n * ```javascript\n * import { u8aToString } from '@polkadot/util';\n *\n * u8aToString(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])); // hello\n * ```\n */\n\nfunction u8aToString(value) {\n  return !(value !== null && value !== void 0 && value.length) ? '' : decoder.decode(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toString.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.u8aToU8a = u8aToU8a;\n\nvar _toU8a = __webpack_require__(/*! ../buffer/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/buffer/toU8a.js\");\n\nvar _toU8a2 = __webpack_require__(/*! ../hex/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/hex/toU8a.js\");\n\nvar _buffer = __webpack_require__(/*! ../is/buffer */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/buffer.js\");\n\nvar _hex = __webpack_require__(/*! ../is/hex */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/hex.js\");\n\nvar _string = __webpack_require__(/*! ../is/string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\nvar _toU8a3 = __webpack_require__(/*! ../string/toU8a */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/string/toU8a.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nfunction convertArray(value) {\n  return Array.isArray(value) ? Uint8Array.from(value) : value;\n}\n\nfunction convertString(value) {\n  return (0, _hex.isHex)(value) ? (0, _toU8a2.hexToU8a)(value) : (0, _toU8a3.stringToU8a)(value);\n}\n/**\n * @name u8aToU8a\n * @summary Creates a Uint8Array value from a Uint8Array, Buffer, string or hex input.\n * @description\n * `null` or `undefined` inputs returns a `[]` result, Uint8Array values returns the value, hex strings returns a Uint8Array representation.\n * @example\n * <BR>\n *\n * ```javascript\n * import { { u8aToU8a } from '@polkadot/util';\n *\n * u8aToU8a(new Uint8Array([0x12, 0x34]); // => Uint8Array([0x12, 0x34])\n * u8aToU8a(0x1234); // => Uint8Array([0x12, 0x34])\n * ```\n */\n\n\nfunction u8aToU8a(value) {\n  if (!value) {\n    return new Uint8Array();\n  } else if ((0, _buffer.isBuffer)(value)) {\n    return (0, _toU8a.bufferToU8a)(value);\n  } else if ((0, _string.isString)(value)) {\n    return convertString(value);\n  }\n\n  return convertArray(value);\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/u8a/toU8a.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/versionDetect.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/versionDetect.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.detectPackage = detectPackage;\n\nvar _xGlobal = __webpack_require__(/*! @polkadot/x-global */ \"./node_modules/@polkadot/x-global/index.js\");\n\nvar _function = __webpack_require__(/*! ./is/function */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/function.js\");\n\nvar _string = __webpack_require__(/*! ./is/string */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/is/string.js\");\n\nvar _assert = __webpack_require__(/*! ./assert */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/assert.js\");\n\n// Copyright 2017-2021 @polkadot/util authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst DEDUPE = 'Either remove and explicitly install matching versions or deupe using your package manager.\\nThe following conflicting packages were found:';\n/** @internal */\n\nfunction getEntry(name) {\n  const _global = _xGlobal.xglobal;\n\n  if (!_global.__polkadotjs) {\n    _global.__polkadotjs = {};\n  }\n\n  if (!_global.__polkadotjs[name]) {\n    _global.__polkadotjs[name] = [];\n  }\n\n  return _global.__polkadotjs[name];\n}\n\nfunction getVersionLength(all) {\n  return all.reduce((max, {\n    version\n  }) => Math.max(max, version.length), 0);\n}\n/** @internal */\n\n\nfunction flattenInfos(all) {\n  const verLength = getVersionLength(all);\n  return all.map(({\n    name,\n    version\n  }) => `\\t${version.padEnd(verLength)}\\t${name}`).join('\\n');\n}\n/** @internal */\n\n\nfunction flattenVersions(entry) {\n  const all = entry.map(version => (0, _string.isString)(version) ? {\n    version\n  } : version);\n  const verLength = getVersionLength(all);\n  return all.map(({\n    path,\n    version\n  }) => `\\t${version.padEnd(verLength)}\\t${!path || path.length < 5 ? '<unknown>' : path}`).join('\\n');\n}\n/** @internal */\n\n\nfunction getPath(pathOrFn) {\n  if ((0, _function.isFunction)(pathOrFn)) {\n    try {\n      return pathOrFn() || '';\n    } catch (error) {\n      return '';\n    }\n  }\n\n  return pathOrFn || '';\n}\n/**\n * @name detectPackage\n * @summary Checks that a specific package is only imported once\n */\n\n\nfunction detectPackage({\n  name,\n  version\n}, pathOrFn, deps = []) {\n  (0, _assert.assert)(name.startsWith('@polkadot'), `Invalid package descriptor ${name}`);\n  const entry = getEntry(name);\n  entry.push({\n    path: getPath(pathOrFn),\n    version\n  });\n\n  if (entry.length !== 1) {\n    console.warn(`${name} has multiple versions, ensure that there is only one installed.\\n${DEDUPE}\\n${flattenVersions(entry)}`);\n  } else {\n    const mismatches = deps.filter(d => d && d.version !== version);\n\n    if (mismatches.length) {\n      console.warn(`${name} requires direct dependencies exactly matching version ${version}.\\n${DEDUPE}\\n${flattenInfos(mismatches)}`);\n    }\n  }\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/versionDetect.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/browser.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/browser.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"packageInfo\", {\n  enumerable: true,\n  get: function () {\n    return _packageInfo.packageInfo;\n  }\n});\nexports.TextDecoder = void 0;\n\nvar _xGlobal = __webpack_require__(/*! @polkadot/x-global */ \"./node_modules/@polkadot/x-global/index.js\");\n\nvar _fallback = __webpack_require__(/*! ./fallback */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/fallback.js\");\n\nvar _packageInfo = __webpack_require__(/*! ./packageInfo */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/packageInfo.js\");\n\n// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst TextDecoder = typeof _xGlobal.xglobal.TextDecoder === 'undefined' ? _fallback.TextDecoder : _xGlobal.xglobal.TextDecoder;\nexports.TextDecoder = TextDecoder;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/browser.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/fallback.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/fallback.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.TextDecoder = void 0;\n\n// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// This is very limited, only handling Ascii values\nclass TextDecoder {\n  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-useless-constructor\n  constructor(_) {// nothing\n  }\n\n  decode(value) {\n    return value.reduce((str, code) => {\n      return str + String.fromCharCode(code);\n    }, '');\n  }\n\n}\n\nexports.TextDecoder = TextDecoder;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/fallback.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/packageInfo.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/packageInfo.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.packageInfo = void 0;\n// Copyright 2017-2021 @polkadot/dev authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// Auto-generated by @polkadot/dev, do not edit\nconst packageInfo = {\n  name: '@polkadot/x-textdecoder',\n  version: '5.9.2'\n};\nexports.packageInfo = packageInfo;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textdecoder/packageInfo.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/browser.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/browser.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"packageInfo\", {\n  enumerable: true,\n  get: function () {\n    return _packageInfo.packageInfo;\n  }\n});\nexports.TextEncoder = void 0;\n\nvar _xGlobal = __webpack_require__(/*! @polkadot/x-global */ \"./node_modules/@polkadot/x-global/index.js\");\n\nvar _fallback = __webpack_require__(/*! ./fallback */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/fallback.js\");\n\nvar _packageInfo = __webpack_require__(/*! ./packageInfo */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/packageInfo.js\");\n\n// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst TextEncoder = typeof _xGlobal.xglobal.TextEncoder === 'undefined' ? _fallback.TextEncoder : _xGlobal.xglobal.TextEncoder;\nexports.TextEncoder = TextEncoder;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/browser.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/fallback.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/fallback.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.TextEncoder = void 0;\n\n// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// This is very limited, only handling Ascii values\nclass TextEncoder {\n  encode(value) {\n    const u8a = new Uint8Array(value.length);\n\n    for (let i = 0; i < value.length; i++) {\n      u8a[i] = value.charCodeAt(i);\n    }\n\n    return u8a;\n  }\n\n}\n\nexports.TextEncoder = TextEncoder;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/fallback.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/packageInfo.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/packageInfo.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.packageInfo = void 0;\n// Copyright 2017-2021 @polkadot/dev authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// Auto-generated by @polkadot/dev, do not edit\nconst packageInfo = {\n  name: '@polkadot/x-textencoder',\n  version: '5.9.2'\n};\nexports.packageInfo = packageInfo;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/node_modules/@polkadot/x-textencoder/packageInfo.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/Accounts.js":
/*!****************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/Accounts.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n// Copyright 2019-2021 @polkadot/extension authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// External to class, this.# is not private enough (yet)\nlet sendRequest;\n\nclass Accounts {\n  constructor(_sendRequest) {\n    sendRequest = _sendRequest;\n  }\n\n  get(anyType) {\n    return sendRequest('pub(accounts.list)', {\n      anyType\n    });\n  }\n\n  subscribe(cb) {\n    sendRequest('pub(accounts.subscribe)', null, cb).catch(error => console.error(error));\n    return () => {// FIXME we need the ability to unsubscribe\n    };\n  }\n\n}\n\nexports.default = Accounts;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/Accounts.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/Injected.js":
/*!****************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/Injected.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _Accounts = _interopRequireDefault(__webpack_require__(/*! ./Accounts */ \"./node_modules/@polkadot/extension-base/page/Accounts.js\"));\n\nvar _Metadata = _interopRequireDefault(__webpack_require__(/*! ./Metadata */ \"./node_modules/@polkadot/extension-base/page/Metadata.js\"));\n\nvar _PostMessageProvider = _interopRequireDefault(__webpack_require__(/*! ./PostMessageProvider */ \"./node_modules/@polkadot/extension-base/page/PostMessageProvider.js\"));\n\nvar _Signer = _interopRequireDefault(__webpack_require__(/*! ./Signer */ \"./node_modules/@polkadot/extension-base/page/Signer.js\"));\n\n// Copyright 2019-2021 @polkadot/extension authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nclass _default {\n  constructor(sendRequest) {\n    this.accounts = void 0;\n    this.metadata = void 0;\n    this.provider = void 0;\n    this.signer = void 0;\n    this.accounts = new _Accounts.default(sendRequest);\n    this.metadata = new _Metadata.default(sendRequest);\n    this.provider = new _PostMessageProvider.default(sendRequest);\n    this.signer = new _Signer.default(sendRequest);\n  }\n\n}\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/Injected.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/Metadata.js":
/*!****************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/Metadata.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n// Copyright 2019-2021 @polkadot/extension authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// External to class, this.# is not private enough (yet)\nlet sendRequest;\n\nclass Metadata {\n  constructor(_sendRequest) {\n    sendRequest = _sendRequest;\n  }\n\n  get() {\n    return sendRequest('pub(metadata.list)');\n  }\n\n  provide(definition) {\n    return sendRequest('pub(metadata.provide)', definition);\n  }\n\n}\n\nexports.default = Metadata;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/Metadata.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/PostMessageProvider.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/PostMessageProvider.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _classPrivateFieldLooseBase2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldLooseBase */ \"./node_modules/@babel/runtime/helpers/classPrivateFieldLooseBase.js\"));\n\nvar _classPrivateFieldLooseKey2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classPrivateFieldLooseKey */ \"./node_modules/@babel/runtime/helpers/classPrivateFieldLooseKey.js\"));\n\nvar _eventemitter2 = _interopRequireDefault(__webpack_require__(/*! eventemitter3 */ \"./node_modules/eventemitter3/index.js\"));\n\nvar _util = __webpack_require__(/*! @polkadot/util */ \"./node_modules/@polkadot/extension-base/node_modules/@polkadot/util/index.js\");\n\n// Copyright 2019-2021 @polkadot/extension-base authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst l = (0, _util.logger)('PostMessageProvider');\n// External to class, this.# is not private enough (yet)\nlet sendRequest;\n/**\n * @name PostMessageProvider\n *\n * @description Extension provider to be used by dapps\n */\n\nvar _eventemitter = (0, _classPrivateFieldLooseKey2.default)(\"eventemitter\");\n\nvar _isConnected = (0, _classPrivateFieldLooseKey2.default)(\"isConnected\");\n\nvar _subscriptions = (0, _classPrivateFieldLooseKey2.default)(\"subscriptions\");\n\nclass PostMessageProvider {\n  // Whether or not the actual extension background provider is connected\n  // Subscription IDs are (historically) not guaranteed to be globally unique;\n  // only unique for a given subscription method; which is why we identify\n  // the subscriptions based on subscription id + type\n  // {[(type,subscriptionId)]: callback}\n\n  /**\n   * @param {function}  sendRequest  The function to be called to send requests to the node\n   * @param {function}  subscriptionNotificationHandler  Channel for receiving subscription messages\n   */\n  constructor(_sendRequest) {\n    Object.defineProperty(this, _eventemitter, {\n      writable: true,\n      value: void 0\n    });\n    Object.defineProperty(this, _isConnected, {\n      writable: true,\n      value: false\n    });\n    Object.defineProperty(this, _subscriptions, {\n      writable: true,\n      value: {}\n    });\n    (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter] = new _eventemitter2.default();\n    sendRequest = _sendRequest;\n  }\n  /**\n   * @description Returns a clone of the object\n   */\n\n\n  clone() {\n    return new PostMessageProvider(sendRequest);\n  }\n  /**\n   * @description Manually disconnect from the connection, clearing autoconnect logic\n   */\n  // eslint-disable-next-line @typescript-eslint/require-await\n\n\n  async connect() {\n    // FIXME This should see if the extension's state's provider can disconnect\n    console.error('PostMessageProvider.disconnect() is not implemented.');\n  }\n  /**\n   * @description Manually disconnect from the connection, clearing autoconnect logic\n   */\n  // eslint-disable-next-line @typescript-eslint/require-await\n\n\n  async disconnect() {\n    // FIXME This should see if the extension's state's provider can disconnect\n    console.error('PostMessageProvider.disconnect() is not implemented.');\n  }\n  /**\n   * @summary `true` when this provider supports subscriptions\n   */\n\n\n  get hasSubscriptions() {\n    // FIXME This should see if the extension's state's provider has subscriptions\n    return true;\n  }\n  /**\n   * @summary Whether the node is connected or not.\n   * @return {boolean} true if connected\n   */\n\n\n  get isConnected() {\n    return (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected];\n  }\n\n  listProviders() {\n    return sendRequest('pub(rpc.listProviders)', undefined);\n  }\n  /**\n   * @summary Listens on events after having subscribed using the [[subscribe]] function.\n   * @param  {ProviderInterfaceEmitted} type Event\n   * @param  {ProviderInterfaceEmitCb}  sub  Callback\n   * @return unsubscribe function\n   */\n\n\n  on(type, sub) {\n    (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].on(type, sub);\n\n    return () => {\n      (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].removeListener(type, sub);\n    };\n  } // eslint-disable-next-line @typescript-eslint/no-explicit-any\n\n\n  async send(method, params, subscription) {\n    if (subscription) {\n      const {\n        callback,\n        type\n      } = subscription;\n      const id = await sendRequest('pub(rpc.subscribe)', {\n        method,\n        params,\n        type\n      }, res => {\n        subscription.callback(null, res);\n      });\n      (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][`${type}::${id}`] = callback;\n      return id;\n    }\n\n    return sendRequest('pub(rpc.send)', {\n      method,\n      params\n    });\n  }\n  /**\n   * @summary Spawn a provider on the extension background.\n   */\n\n\n  async startProvider(key) {\n    // Disconnect from the previous provider\n    (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected] = false;\n\n    (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].emit('disconnected');\n\n    const meta = await sendRequest('pub(rpc.startProvider)', key); // eslint-disable-next-line @typescript-eslint/no-floating-promises\n\n    sendRequest('pub(rpc.subscribeConnected)', null, connected => {\n      (0, _classPrivateFieldLooseBase2.default)(this, _isConnected)[_isConnected] = connected;\n\n      if (connected) {\n        (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].emit('connected');\n      } else {\n        (0, _classPrivateFieldLooseBase2.default)(this, _eventemitter)[_eventemitter].emit('disconnected');\n      }\n\n      return true;\n    });\n    return meta;\n  }\n\n  subscribe(type, method, params, callback) {\n    return this.send(method, params, {\n      callback,\n      type\n    });\n  }\n  /**\n   * @summary Allows unsubscribing to subscriptions made with [[subscribe]].\n   */\n\n\n  async unsubscribe(type, method, id) {\n    const subscription = `${type}::${id}`; // FIXME This now could happen with re-subscriptions. The issue is that with a re-sub\n    // the assigned id now does not match what the API user originally received. It has\n    // a slight complication in solving - since we cannot rely on the send id, but rather\n    // need to find the actual subscription id to map it\n\n    if ((0, _util.isUndefined)((0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subscription])) {\n      l.debug(() => `Unable to find active subscription=${subscription}`);\n      return false;\n    }\n\n    delete (0, _classPrivateFieldLooseBase2.default)(this, _subscriptions)[_subscriptions][subscription];\n    return this.send(method, [id]);\n  }\n\n}\n\nexports.default = PostMessageProvider;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/PostMessageProvider.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/Signer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/Signer.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\"));\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n// Copyright 2019-2021 @polkadot/extension-base authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// External to class, this.# is not private enough (yet)\nlet sendRequest;\nlet nextId = 0;\n\nclass Signer {\n  constructor(_sendRequest) {\n    sendRequest = _sendRequest;\n  }\n\n  async signPayload(payload) {\n    const id = ++nextId;\n    const result = await sendRequest('pub(extrinsic.sign)', payload); // we add an internal id (number) - should have a mapping from the\n    // extension id (string) -> internal id (number) if we wish to provide\n    // updated via the update functionality (noop at this point)\n\n    return _objectSpread(_objectSpread({}, result), {}, {\n      id\n    });\n  }\n\n  async signRaw(payload) {\n    const id = ++nextId;\n    const result = await sendRequest('pub(bytes.sign)', payload);\n    return _objectSpread(_objectSpread({}, result), {}, {\n      id\n    });\n  } // NOTE We don't listen to updates at all, if we do we can interpret the\n  // resuklt as provided by the API here\n  // public update (id: number, status: Hash | SubmittableResult): void {\n  //   // ignore\n  // }\n\n\n}\n\nexports.default = Signer;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/Signer.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-base/page/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@polkadot/extension-base/page/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.sendMessage = sendMessage;\nexports.enable = enable;\nexports.redirectIfPhishing = redirectIfPhishing;\nexports.handleResponse = handleResponse;\n\nvar _Injected = _interopRequireDefault(__webpack_require__(/*! ./Injected */ \"./node_modules/@polkadot/extension-base/page/Injected.js\"));\n\n// Copyright 2019-2021 @polkadot/extension authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst handlers = {};\nlet idCounter = 0; // a generic message sender that creates an event, returning a promise that will\n// resolve once the event is resolved (by the response listener just below this)\n\nfunction sendMessage(message, request, subscriber) {\n  return new Promise((resolve, reject) => {\n    const id = `${Date.now()}.${++idCounter}`;\n    handlers[id] = {\n      reject,\n      resolve,\n      subscriber\n    };\n    const transportRequestMessage = {\n      id,\n      message,\n      origin: 'page',\n      request: request || null\n    };\n    window.postMessage(transportRequestMessage, '*');\n  });\n} // the enable function, called by the dapp to allow access\n\n\nasync function enable(origin) {\n  await sendMessage('pub(authorize.tab)', {\n    origin\n  });\n  return new _Injected.default(sendMessage);\n} // redirect users if this page is considered as phishing, otherwise return false\n\n\nasync function redirectIfPhishing() {\n  const res = await sendMessage('pub(phishing.redirectIfDenied)');\n  return res;\n}\n\nfunction handleResponse(data) {\n  const handler = handlers[data.id];\n\n  if (!handler) {\n    console.error(`Unknown response: ${JSON.stringify(data)}`);\n    return;\n  }\n\n  if (!handler.subscriber) {\n    delete handlers[data.id];\n  }\n\n  if (data.subscription) {\n    // eslint-disable-next-line @typescript-eslint/ban-types\n    handler.subscriber(data.subscription);\n  } else if (data.error) {\n    handler.reject(new Error(data.error));\n  } else {\n    handler.resolve(data.response);\n  }\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-base/page/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/extension-inject/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@polkadot/extension-inject/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.injectExtension = injectExtension;\n\n// Copyright 2019-2021 @polkadot/extension-inject authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// It is recommended to always use the function below to shield the extension and dapp from\n// any future changes. The exposed interface will manage access between the 2 environments,\n// be it via window (current), postMessage (under consideration) or any other mechanism\nfunction injectExtension(enable, {\n  name,\n  version\n}) {\n  // small helper with the typescript types, just cast window\n  const windowInject = window; // don't clobber the existing object, we will add it (or create as needed)\n\n  windowInject.injectedWeb3 = windowInject.injectedWeb3 || {}; // add our enable function\n\n  windowInject.injectedWeb3[name] = {\n    enable: origin => enable(origin),\n    version\n  };\n}\n\n//# sourceURL=webpack:///./node_modules/@polkadot/extension-inject/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/x-global/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@polkadot/x-global/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"packageInfo\", {\n  enumerable: true,\n  get: function () {\n    return _packageInfo.packageInfo;\n  }\n});\nexports.xglobal = void 0;\n\nvar _packageInfo = __webpack_require__(/*! ./packageInfo */ \"./node_modules/@polkadot/x-global/packageInfo.js\");\n\n// Copyright 2017-2021 @polkadot/x-fetch authors & contributors\n// SPDX-License-Identifier: Apache-2.0\nconst xglobal = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : void 0;\nexports.xglobal = xglobal;\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/@polkadot/x-global/index.js?");

/***/ }),

/***/ "./node_modules/@polkadot/x-global/packageInfo.js":
/*!********************************************************!*\
  !*** ./node_modules/@polkadot/x-global/packageInfo.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.packageInfo = void 0;\n// Copyright 2017-2021 @polkadot/dev authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n// Auto-generated by @polkadot/dev, do not edit\nconst packageInfo = {\n  name: '@polkadot/x-global',\n  version: '5.9.2'\n};\nexports.packageInfo = packageInfo;\n\n//# sourceURL=webpack:///./node_modules/@polkadot/x-global/packageInfo.js?");

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.byteLength = byteLength\nexports.toByteArray = toByteArray\nexports.fromByteArray = fromByteArray\n\nvar lookup = []\nvar revLookup = []\nvar Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array\n\nvar code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'\nfor (var i = 0, len = code.length; i < len; ++i) {\n  lookup[i] = code[i]\n  revLookup[code.charCodeAt(i)] = i\n}\n\n// Support decoding URL-safe base64 strings, as Node.js does.\n// See: https://en.wikipedia.org/wiki/Base64#URL_applications\nrevLookup['-'.charCodeAt(0)] = 62\nrevLookup['_'.charCodeAt(0)] = 63\n\nfunction getLens (b64) {\n  var len = b64.length\n\n  if (len % 4 > 0) {\n    throw new Error('Invalid string. Length must be a multiple of 4')\n  }\n\n  // Trim off extra bytes after placeholder bytes are found\n  // See: https://github.com/beatgammit/base64-js/issues/42\n  var validLen = b64.indexOf('=')\n  if (validLen === -1) validLen = len\n\n  var placeHoldersLen = validLen === len\n    ? 0\n    : 4 - (validLen % 4)\n\n  return [validLen, placeHoldersLen]\n}\n\n// base64 is 4/3 + up to two characters of the original data\nfunction byteLength (b64) {\n  var lens = getLens(b64)\n  var validLen = lens[0]\n  var placeHoldersLen = lens[1]\n  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen\n}\n\nfunction _byteLength (b64, validLen, placeHoldersLen) {\n  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen\n}\n\nfunction toByteArray (b64) {\n  var tmp\n  var lens = getLens(b64)\n  var validLen = lens[0]\n  var placeHoldersLen = lens[1]\n\n  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))\n\n  var curByte = 0\n\n  // if there are placeholders, only get up to the last complete 4 chars\n  var len = placeHoldersLen > 0\n    ? validLen - 4\n    : validLen\n\n  var i\n  for (i = 0; i < len; i += 4) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 18) |\n      (revLookup[b64.charCodeAt(i + 1)] << 12) |\n      (revLookup[b64.charCodeAt(i + 2)] << 6) |\n      revLookup[b64.charCodeAt(i + 3)]\n    arr[curByte++] = (tmp >> 16) & 0xFF\n    arr[curByte++] = (tmp >> 8) & 0xFF\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  if (placeHoldersLen === 2) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 2) |\n      (revLookup[b64.charCodeAt(i + 1)] >> 4)\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  if (placeHoldersLen === 1) {\n    tmp =\n      (revLookup[b64.charCodeAt(i)] << 10) |\n      (revLookup[b64.charCodeAt(i + 1)] << 4) |\n      (revLookup[b64.charCodeAt(i + 2)] >> 2)\n    arr[curByte++] = (tmp >> 8) & 0xFF\n    arr[curByte++] = tmp & 0xFF\n  }\n\n  return arr\n}\n\nfunction tripletToBase64 (num) {\n  return lookup[num >> 18 & 0x3F] +\n    lookup[num >> 12 & 0x3F] +\n    lookup[num >> 6 & 0x3F] +\n    lookup[num & 0x3F]\n}\n\nfunction encodeChunk (uint8, start, end) {\n  var tmp\n  var output = []\n  for (var i = start; i < end; i += 3) {\n    tmp =\n      ((uint8[i] << 16) & 0xFF0000) +\n      ((uint8[i + 1] << 8) & 0xFF00) +\n      (uint8[i + 2] & 0xFF)\n    output.push(tripletToBase64(tmp))\n  }\n  return output.join('')\n}\n\nfunction fromByteArray (uint8) {\n  var tmp\n  var len = uint8.length\n  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes\n  var parts = []\n  var maxChunkLength = 16383 // must be multiple of 3\n\n  // go through the array every three bytes, we'll deal with trailing stuff later\n  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {\n    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))\n  }\n\n  // pad the end with zeros, but make sure to not forget the extra bytes\n  if (extraBytes === 1) {\n    tmp = uint8[len - 1]\n    parts.push(\n      lookup[tmp >> 2] +\n      lookup[(tmp << 4) & 0x3F] +\n      '=='\n    )\n  } else if (extraBytes === 2) {\n    tmp = (uint8[len - 2] << 8) + uint8[len - 1]\n    parts.push(\n      lookup[tmp >> 10] +\n      lookup[(tmp >> 4) & 0x3F] +\n      lookup[(tmp << 2) & 0x3F] +\n      '='\n    )\n  }\n\n  return parts.join('')\n}\n\n\n//# sourceURL=webpack:///./node_modules/base64-js/index.js?");

/***/ }),

/***/ "./node_modules/bn.js/lib/bn.js":
/*!**************************************!*\
  !*** ./node_modules/bn.js/lib/bn.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module) {(function (module, exports) {\n  'use strict';\n\n  // Utils\n  function assert (val, msg) {\n    if (!val) throw new Error(msg || 'Assertion failed');\n  }\n\n  // Could use `inherits` module, but don't want to move from single file\n  // architecture yet.\n  function inherits (ctor, superCtor) {\n    ctor.super_ = superCtor;\n    var TempCtor = function () {};\n    TempCtor.prototype = superCtor.prototype;\n    ctor.prototype = new TempCtor();\n    ctor.prototype.constructor = ctor;\n  }\n\n  // BN\n\n  function BN (number, base, endian) {\n    if (BN.isBN(number)) {\n      return number;\n    }\n\n    this.negative = 0;\n    this.words = null;\n    this.length = 0;\n\n    // Reduction context\n    this.red = null;\n\n    if (number !== null) {\n      if (base === 'le' || base === 'be') {\n        endian = base;\n        base = 10;\n      }\n\n      this._init(number || 0, base || 10, endian || 'be');\n    }\n  }\n  if (typeof module === 'object') {\n    module.exports = BN;\n  } else {\n    exports.BN = BN;\n  }\n\n  BN.BN = BN;\n  BN.wordSize = 26;\n\n  var Buffer;\n  try {\n    if (typeof window !== 'undefined' && typeof window.Buffer !== 'undefined') {\n      Buffer = window.Buffer;\n    } else {\n      Buffer = __webpack_require__(/*! buffer */ 1).Buffer;\n    }\n  } catch (e) {\n  }\n\n  BN.isBN = function isBN (num) {\n    if (num instanceof BN) {\n      return true;\n    }\n\n    return num !== null && typeof num === 'object' &&\n      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);\n  };\n\n  BN.max = function max (left, right) {\n    if (left.cmp(right) > 0) return left;\n    return right;\n  };\n\n  BN.min = function min (left, right) {\n    if (left.cmp(right) < 0) return left;\n    return right;\n  };\n\n  BN.prototype._init = function init (number, base, endian) {\n    if (typeof number === 'number') {\n      return this._initNumber(number, base, endian);\n    }\n\n    if (typeof number === 'object') {\n      return this._initArray(number, base, endian);\n    }\n\n    if (base === 'hex') {\n      base = 16;\n    }\n    assert(base === (base | 0) && base >= 2 && base <= 36);\n\n    number = number.toString().replace(/\\s+/g, '');\n    var start = 0;\n    if (number[0] === '-') {\n      start++;\n      this.negative = 1;\n    }\n\n    if (start < number.length) {\n      if (base === 16) {\n        this._parseHex(number, start, endian);\n      } else {\n        this._parseBase(number, base, start);\n        if (endian === 'le') {\n          this._initArray(this.toArray(), base, endian);\n        }\n      }\n    }\n  };\n\n  BN.prototype._initNumber = function _initNumber (number, base, endian) {\n    if (number < 0) {\n      this.negative = 1;\n      number = -number;\n    }\n    if (number < 0x4000000) {\n      this.words = [ number & 0x3ffffff ];\n      this.length = 1;\n    } else if (number < 0x10000000000000) {\n      this.words = [\n        number & 0x3ffffff,\n        (number / 0x4000000) & 0x3ffffff\n      ];\n      this.length = 2;\n    } else {\n      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)\n      this.words = [\n        number & 0x3ffffff,\n        (number / 0x4000000) & 0x3ffffff,\n        1\n      ];\n      this.length = 3;\n    }\n\n    if (endian !== 'le') return;\n\n    // Reverse the bytes\n    this._initArray(this.toArray(), base, endian);\n  };\n\n  BN.prototype._initArray = function _initArray (number, base, endian) {\n    // Perhaps a Uint8Array\n    assert(typeof number.length === 'number');\n    if (number.length <= 0) {\n      this.words = [ 0 ];\n      this.length = 1;\n      return this;\n    }\n\n    this.length = Math.ceil(number.length / 3);\n    this.words = new Array(this.length);\n    for (var i = 0; i < this.length; i++) {\n      this.words[i] = 0;\n    }\n\n    var j, w;\n    var off = 0;\n    if (endian === 'be') {\n      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {\n        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);\n        this.words[j] |= (w << off) & 0x3ffffff;\n        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;\n        off += 24;\n        if (off >= 26) {\n          off -= 26;\n          j++;\n        }\n      }\n    } else if (endian === 'le') {\n      for (i = 0, j = 0; i < number.length; i += 3) {\n        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);\n        this.words[j] |= (w << off) & 0x3ffffff;\n        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;\n        off += 24;\n        if (off >= 26) {\n          off -= 26;\n          j++;\n        }\n      }\n    }\n    return this.strip();\n  };\n\n  function parseHex4Bits (string, index) {\n    var c = string.charCodeAt(index);\n    // 'A' - 'F'\n    if (c >= 65 && c <= 70) {\n      return c - 55;\n    // 'a' - 'f'\n    } else if (c >= 97 && c <= 102) {\n      return c - 87;\n    // '0' - '9'\n    } else {\n      return (c - 48) & 0xf;\n    }\n  }\n\n  function parseHexByte (string, lowerBound, index) {\n    var r = parseHex4Bits(string, index);\n    if (index - 1 >= lowerBound) {\n      r |= parseHex4Bits(string, index - 1) << 4;\n    }\n    return r;\n  }\n\n  BN.prototype._parseHex = function _parseHex (number, start, endian) {\n    // Create possibly bigger array to ensure that it fits the number\n    this.length = Math.ceil((number.length - start) / 6);\n    this.words = new Array(this.length);\n    for (var i = 0; i < this.length; i++) {\n      this.words[i] = 0;\n    }\n\n    // 24-bits chunks\n    var off = 0;\n    var j = 0;\n\n    var w;\n    if (endian === 'be') {\n      for (i = number.length - 1; i >= start; i -= 2) {\n        w = parseHexByte(number, start, i) << off;\n        this.words[j] |= w & 0x3ffffff;\n        if (off >= 18) {\n          off -= 18;\n          j += 1;\n          this.words[j] |= w >>> 26;\n        } else {\n          off += 8;\n        }\n      }\n    } else {\n      var parseLength = number.length - start;\n      for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {\n        w = parseHexByte(number, start, i) << off;\n        this.words[j] |= w & 0x3ffffff;\n        if (off >= 18) {\n          off -= 18;\n          j += 1;\n          this.words[j] |= w >>> 26;\n        } else {\n          off += 8;\n        }\n      }\n    }\n\n    this.strip();\n  };\n\n  function parseBase (str, start, end, mul) {\n    var r = 0;\n    var len = Math.min(str.length, end);\n    for (var i = start; i < len; i++) {\n      var c = str.charCodeAt(i) - 48;\n\n      r *= mul;\n\n      // 'a'\n      if (c >= 49) {\n        r += c - 49 + 0xa;\n\n      // 'A'\n      } else if (c >= 17) {\n        r += c - 17 + 0xa;\n\n      // '0' - '9'\n      } else {\n        r += c;\n      }\n    }\n    return r;\n  }\n\n  BN.prototype._parseBase = function _parseBase (number, base, start) {\n    // Initialize as zero\n    this.words = [ 0 ];\n    this.length = 1;\n\n    // Find length of limb in base\n    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {\n      limbLen++;\n    }\n    limbLen--;\n    limbPow = (limbPow / base) | 0;\n\n    var total = number.length - start;\n    var mod = total % limbLen;\n    var end = Math.min(total, total - mod) + start;\n\n    var word = 0;\n    for (var i = start; i < end; i += limbLen) {\n      word = parseBase(number, i, i + limbLen, base);\n\n      this.imuln(limbPow);\n      if (this.words[0] + word < 0x4000000) {\n        this.words[0] += word;\n      } else {\n        this._iaddn(word);\n      }\n    }\n\n    if (mod !== 0) {\n      var pow = 1;\n      word = parseBase(number, i, number.length, base);\n\n      for (i = 0; i < mod; i++) {\n        pow *= base;\n      }\n\n      this.imuln(pow);\n      if (this.words[0] + word < 0x4000000) {\n        this.words[0] += word;\n      } else {\n        this._iaddn(word);\n      }\n    }\n\n    this.strip();\n  };\n\n  BN.prototype.copy = function copy (dest) {\n    dest.words = new Array(this.length);\n    for (var i = 0; i < this.length; i++) {\n      dest.words[i] = this.words[i];\n    }\n    dest.length = this.length;\n    dest.negative = this.negative;\n    dest.red = this.red;\n  };\n\n  BN.prototype.clone = function clone () {\n    var r = new BN(null);\n    this.copy(r);\n    return r;\n  };\n\n  BN.prototype._expand = function _expand (size) {\n    while (this.length < size) {\n      this.words[this.length++] = 0;\n    }\n    return this;\n  };\n\n  // Remove leading `0` from `this`\n  BN.prototype.strip = function strip () {\n    while (this.length > 1 && this.words[this.length - 1] === 0) {\n      this.length--;\n    }\n    return this._normSign();\n  };\n\n  BN.prototype._normSign = function _normSign () {\n    // -0 = 0\n    if (this.length === 1 && this.words[0] === 0) {\n      this.negative = 0;\n    }\n    return this;\n  };\n\n  BN.prototype.inspect = function inspect () {\n    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';\n  };\n\n  /*\n\n  var zeros = [];\n  var groupSizes = [];\n  var groupBases = [];\n\n  var s = '';\n  var i = -1;\n  while (++i < BN.wordSize) {\n    zeros[i] = s;\n    s += '0';\n  }\n  groupSizes[0] = 0;\n  groupSizes[1] = 0;\n  groupBases[0] = 0;\n  groupBases[1] = 0;\n  var base = 2 - 1;\n  while (++base < 36 + 1) {\n    var groupSize = 0;\n    var groupBase = 1;\n    while (groupBase < (1 << BN.wordSize) / base) {\n      groupBase *= base;\n      groupSize += 1;\n    }\n    groupSizes[base] = groupSize;\n    groupBases[base] = groupBase;\n  }\n\n  */\n\n  var zeros = [\n    '',\n    '0',\n    '00',\n    '000',\n    '0000',\n    '00000',\n    '000000',\n    '0000000',\n    '00000000',\n    '000000000',\n    '0000000000',\n    '00000000000',\n    '000000000000',\n    '0000000000000',\n    '00000000000000',\n    '000000000000000',\n    '0000000000000000',\n    '00000000000000000',\n    '000000000000000000',\n    '0000000000000000000',\n    '00000000000000000000',\n    '000000000000000000000',\n    '0000000000000000000000',\n    '00000000000000000000000',\n    '000000000000000000000000',\n    '0000000000000000000000000'\n  ];\n\n  var groupSizes = [\n    0, 0,\n    25, 16, 12, 11, 10, 9, 8,\n    8, 7, 7, 7, 7, 6, 6,\n    6, 6, 6, 6, 6, 5, 5,\n    5, 5, 5, 5, 5, 5, 5,\n    5, 5, 5, 5, 5, 5, 5\n  ];\n\n  var groupBases = [\n    0, 0,\n    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,\n    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,\n    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,\n    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,\n    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176\n  ];\n\n  BN.prototype.toString = function toString (base, padding) {\n    base = base || 10;\n    padding = padding | 0 || 1;\n\n    var out;\n    if (base === 16 || base === 'hex') {\n      out = '';\n      var off = 0;\n      var carry = 0;\n      for (var i = 0; i < this.length; i++) {\n        var w = this.words[i];\n        var word = (((w << off) | carry) & 0xffffff).toString(16);\n        carry = (w >>> (24 - off)) & 0xffffff;\n        if (carry !== 0 || i !== this.length - 1) {\n          out = zeros[6 - word.length] + word + out;\n        } else {\n          out = word + out;\n        }\n        off += 2;\n        if (off >= 26) {\n          off -= 26;\n          i--;\n        }\n      }\n      if (carry !== 0) {\n        out = carry.toString(16) + out;\n      }\n      while (out.length % padding !== 0) {\n        out = '0' + out;\n      }\n      if (this.negative !== 0) {\n        out = '-' + out;\n      }\n      return out;\n    }\n\n    if (base === (base | 0) && base >= 2 && base <= 36) {\n      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));\n      var groupSize = groupSizes[base];\n      // var groupBase = Math.pow(base, groupSize);\n      var groupBase = groupBases[base];\n      out = '';\n      var c = this.clone();\n      c.negative = 0;\n      while (!c.isZero()) {\n        var r = c.modn(groupBase).toString(base);\n        c = c.idivn(groupBase);\n\n        if (!c.isZero()) {\n          out = zeros[groupSize - r.length] + r + out;\n        } else {\n          out = r + out;\n        }\n      }\n      if (this.isZero()) {\n        out = '0' + out;\n      }\n      while (out.length % padding !== 0) {\n        out = '0' + out;\n      }\n      if (this.negative !== 0) {\n        out = '-' + out;\n      }\n      return out;\n    }\n\n    assert(false, 'Base should be between 2 and 36');\n  };\n\n  BN.prototype.toNumber = function toNumber () {\n    var ret = this.words[0];\n    if (this.length === 2) {\n      ret += this.words[1] * 0x4000000;\n    } else if (this.length === 3 && this.words[2] === 0x01) {\n      // NOTE: at this stage it is known that the top bit is set\n      ret += 0x10000000000000 + (this.words[1] * 0x4000000);\n    } else if (this.length > 2) {\n      assert(false, 'Number can only safely store up to 53 bits');\n    }\n    return (this.negative !== 0) ? -ret : ret;\n  };\n\n  BN.prototype.toJSON = function toJSON () {\n    return this.toString(16);\n  };\n\n  BN.prototype.toBuffer = function toBuffer (endian, length) {\n    assert(typeof Buffer !== 'undefined');\n    return this.toArrayLike(Buffer, endian, length);\n  };\n\n  BN.prototype.toArray = function toArray (endian, length) {\n    return this.toArrayLike(Array, endian, length);\n  };\n\n  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {\n    var byteLength = this.byteLength();\n    var reqLength = length || Math.max(1, byteLength);\n    assert(byteLength <= reqLength, 'byte array longer than desired length');\n    assert(reqLength > 0, 'Requested array length <= 0');\n\n    this.strip();\n    var littleEndian = endian === 'le';\n    var res = new ArrayType(reqLength);\n\n    var b, i;\n    var q = this.clone();\n    if (!littleEndian) {\n      // Assume big-endian\n      for (i = 0; i < reqLength - byteLength; i++) {\n        res[i] = 0;\n      }\n\n      for (i = 0; !q.isZero(); i++) {\n        b = q.andln(0xff);\n        q.iushrn(8);\n\n        res[reqLength - i - 1] = b;\n      }\n    } else {\n      for (i = 0; !q.isZero(); i++) {\n        b = q.andln(0xff);\n        q.iushrn(8);\n\n        res[i] = b;\n      }\n\n      for (; i < reqLength; i++) {\n        res[i] = 0;\n      }\n    }\n\n    return res;\n  };\n\n  if (Math.clz32) {\n    BN.prototype._countBits = function _countBits (w) {\n      return 32 - Math.clz32(w);\n    };\n  } else {\n    BN.prototype._countBits = function _countBits (w) {\n      var t = w;\n      var r = 0;\n      if (t >= 0x1000) {\n        r += 13;\n        t >>>= 13;\n      }\n      if (t >= 0x40) {\n        r += 7;\n        t >>>= 7;\n      }\n      if (t >= 0x8) {\n        r += 4;\n        t >>>= 4;\n      }\n      if (t >= 0x02) {\n        r += 2;\n        t >>>= 2;\n      }\n      return r + t;\n    };\n  }\n\n  BN.prototype._zeroBits = function _zeroBits (w) {\n    // Short-cut\n    if (w === 0) return 26;\n\n    var t = w;\n    var r = 0;\n    if ((t & 0x1fff) === 0) {\n      r += 13;\n      t >>>= 13;\n    }\n    if ((t & 0x7f) === 0) {\n      r += 7;\n      t >>>= 7;\n    }\n    if ((t & 0xf) === 0) {\n      r += 4;\n      t >>>= 4;\n    }\n    if ((t & 0x3) === 0) {\n      r += 2;\n      t >>>= 2;\n    }\n    if ((t & 0x1) === 0) {\n      r++;\n    }\n    return r;\n  };\n\n  // Return number of used bits in a BN\n  BN.prototype.bitLength = function bitLength () {\n    var w = this.words[this.length - 1];\n    var hi = this._countBits(w);\n    return (this.length - 1) * 26 + hi;\n  };\n\n  function toBitArray (num) {\n    var w = new Array(num.bitLength());\n\n    for (var bit = 0; bit < w.length; bit++) {\n      var off = (bit / 26) | 0;\n      var wbit = bit % 26;\n\n      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;\n    }\n\n    return w;\n  }\n\n  // Number of trailing zero bits\n  BN.prototype.zeroBits = function zeroBits () {\n    if (this.isZero()) return 0;\n\n    var r = 0;\n    for (var i = 0; i < this.length; i++) {\n      var b = this._zeroBits(this.words[i]);\n      r += b;\n      if (b !== 26) break;\n    }\n    return r;\n  };\n\n  BN.prototype.byteLength = function byteLength () {\n    return Math.ceil(this.bitLength() / 8);\n  };\n\n  BN.prototype.toTwos = function toTwos (width) {\n    if (this.negative !== 0) {\n      return this.abs().inotn(width).iaddn(1);\n    }\n    return this.clone();\n  };\n\n  BN.prototype.fromTwos = function fromTwos (width) {\n    if (this.testn(width - 1)) {\n      return this.notn(width).iaddn(1).ineg();\n    }\n    return this.clone();\n  };\n\n  BN.prototype.isNeg = function isNeg () {\n    return this.negative !== 0;\n  };\n\n  // Return negative clone of `this`\n  BN.prototype.neg = function neg () {\n    return this.clone().ineg();\n  };\n\n  BN.prototype.ineg = function ineg () {\n    if (!this.isZero()) {\n      this.negative ^= 1;\n    }\n\n    return this;\n  };\n\n  // Or `num` with `this` in-place\n  BN.prototype.iuor = function iuor (num) {\n    while (this.length < num.length) {\n      this.words[this.length++] = 0;\n    }\n\n    for (var i = 0; i < num.length; i++) {\n      this.words[i] = this.words[i] | num.words[i];\n    }\n\n    return this.strip();\n  };\n\n  BN.prototype.ior = function ior (num) {\n    assert((this.negative | num.negative) === 0);\n    return this.iuor(num);\n  };\n\n  // Or `num` with `this`\n  BN.prototype.or = function or (num) {\n    if (this.length > num.length) return this.clone().ior(num);\n    return num.clone().ior(this);\n  };\n\n  BN.prototype.uor = function uor (num) {\n    if (this.length > num.length) return this.clone().iuor(num);\n    return num.clone().iuor(this);\n  };\n\n  // And `num` with `this` in-place\n  BN.prototype.iuand = function iuand (num) {\n    // b = min-length(num, this)\n    var b;\n    if (this.length > num.length) {\n      b = num;\n    } else {\n      b = this;\n    }\n\n    for (var i = 0; i < b.length; i++) {\n      this.words[i] = this.words[i] & num.words[i];\n    }\n\n    this.length = b.length;\n\n    return this.strip();\n  };\n\n  BN.prototype.iand = function iand (num) {\n    assert((this.negative | num.negative) === 0);\n    return this.iuand(num);\n  };\n\n  // And `num` with `this`\n  BN.prototype.and = function and (num) {\n    if (this.length > num.length) return this.clone().iand(num);\n    return num.clone().iand(this);\n  };\n\n  BN.prototype.uand = function uand (num) {\n    if (this.length > num.length) return this.clone().iuand(num);\n    return num.clone().iuand(this);\n  };\n\n  // Xor `num` with `this` in-place\n  BN.prototype.iuxor = function iuxor (num) {\n    // a.length > b.length\n    var a;\n    var b;\n    if (this.length > num.length) {\n      a = this;\n      b = num;\n    } else {\n      a = num;\n      b = this;\n    }\n\n    for (var i = 0; i < b.length; i++) {\n      this.words[i] = a.words[i] ^ b.words[i];\n    }\n\n    if (this !== a) {\n      for (; i < a.length; i++) {\n        this.words[i] = a.words[i];\n      }\n    }\n\n    this.length = a.length;\n\n    return this.strip();\n  };\n\n  BN.prototype.ixor = function ixor (num) {\n    assert((this.negative | num.negative) === 0);\n    return this.iuxor(num);\n  };\n\n  // Xor `num` with `this`\n  BN.prototype.xor = function xor (num) {\n    if (this.length > num.length) return this.clone().ixor(num);\n    return num.clone().ixor(this);\n  };\n\n  BN.prototype.uxor = function uxor (num) {\n    if (this.length > num.length) return this.clone().iuxor(num);\n    return num.clone().iuxor(this);\n  };\n\n  // Not ``this`` with ``width`` bitwidth\n  BN.prototype.inotn = function inotn (width) {\n    assert(typeof width === 'number' && width >= 0);\n\n    var bytesNeeded = Math.ceil(width / 26) | 0;\n    var bitsLeft = width % 26;\n\n    // Extend the buffer with leading zeroes\n    this._expand(bytesNeeded);\n\n    if (bitsLeft > 0) {\n      bytesNeeded--;\n    }\n\n    // Handle complete words\n    for (var i = 0; i < bytesNeeded; i++) {\n      this.words[i] = ~this.words[i] & 0x3ffffff;\n    }\n\n    // Handle the residue\n    if (bitsLeft > 0) {\n      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));\n    }\n\n    // And remove leading zeroes\n    return this.strip();\n  };\n\n  BN.prototype.notn = function notn (width) {\n    return this.clone().inotn(width);\n  };\n\n  // Set `bit` of `this`\n  BN.prototype.setn = function setn (bit, val) {\n    assert(typeof bit === 'number' && bit >= 0);\n\n    var off = (bit / 26) | 0;\n    var wbit = bit % 26;\n\n    this._expand(off + 1);\n\n    if (val) {\n      this.words[off] = this.words[off] | (1 << wbit);\n    } else {\n      this.words[off] = this.words[off] & ~(1 << wbit);\n    }\n\n    return this.strip();\n  };\n\n  // Add `num` to `this` in-place\n  BN.prototype.iadd = function iadd (num) {\n    var r;\n\n    // negative + positive\n    if (this.negative !== 0 && num.negative === 0) {\n      this.negative = 0;\n      r = this.isub(num);\n      this.negative ^= 1;\n      return this._normSign();\n\n    // positive + negative\n    } else if (this.negative === 0 && num.negative !== 0) {\n      num.negative = 0;\n      r = this.isub(num);\n      num.negative = 1;\n      return r._normSign();\n    }\n\n    // a.length > b.length\n    var a, b;\n    if (this.length > num.length) {\n      a = this;\n      b = num;\n    } else {\n      a = num;\n      b = this;\n    }\n\n    var carry = 0;\n    for (var i = 0; i < b.length; i++) {\n      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;\n      this.words[i] = r & 0x3ffffff;\n      carry = r >>> 26;\n    }\n    for (; carry !== 0 && i < a.length; i++) {\n      r = (a.words[i] | 0) + carry;\n      this.words[i] = r & 0x3ffffff;\n      carry = r >>> 26;\n    }\n\n    this.length = a.length;\n    if (carry !== 0) {\n      this.words[this.length] = carry;\n      this.length++;\n    // Copy the rest of the words\n    } else if (a !== this) {\n      for (; i < a.length; i++) {\n        this.words[i] = a.words[i];\n      }\n    }\n\n    return this;\n  };\n\n  // Add `num` to `this`\n  BN.prototype.add = function add (num) {\n    var res;\n    if (num.negative !== 0 && this.negative === 0) {\n      num.negative = 0;\n      res = this.sub(num);\n      num.negative ^= 1;\n      return res;\n    } else if (num.negative === 0 && this.negative !== 0) {\n      this.negative = 0;\n      res = num.sub(this);\n      this.negative = 1;\n      return res;\n    }\n\n    if (this.length > num.length) return this.clone().iadd(num);\n\n    return num.clone().iadd(this);\n  };\n\n  // Subtract `num` from `this` in-place\n  BN.prototype.isub = function isub (num) {\n    // this - (-num) = this + num\n    if (num.negative !== 0) {\n      num.negative = 0;\n      var r = this.iadd(num);\n      num.negative = 1;\n      return r._normSign();\n\n    // -this - num = -(this + num)\n    } else if (this.negative !== 0) {\n      this.negative = 0;\n      this.iadd(num);\n      this.negative = 1;\n      return this._normSign();\n    }\n\n    // At this point both numbers are positive\n    var cmp = this.cmp(num);\n\n    // Optimization - zeroify\n    if (cmp === 0) {\n      this.negative = 0;\n      this.length = 1;\n      this.words[0] = 0;\n      return this;\n    }\n\n    // a > b\n    var a, b;\n    if (cmp > 0) {\n      a = this;\n      b = num;\n    } else {\n      a = num;\n      b = this;\n    }\n\n    var carry = 0;\n    for (var i = 0; i < b.length; i++) {\n      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;\n      carry = r >> 26;\n      this.words[i] = r & 0x3ffffff;\n    }\n    for (; carry !== 0 && i < a.length; i++) {\n      r = (a.words[i] | 0) + carry;\n      carry = r >> 26;\n      this.words[i] = r & 0x3ffffff;\n    }\n\n    // Copy rest of the words\n    if (carry === 0 && i < a.length && a !== this) {\n      for (; i < a.length; i++) {\n        this.words[i] = a.words[i];\n      }\n    }\n\n    this.length = Math.max(this.length, i);\n\n    if (a !== this) {\n      this.negative = 1;\n    }\n\n    return this.strip();\n  };\n\n  // Subtract `num` from `this`\n  BN.prototype.sub = function sub (num) {\n    return this.clone().isub(num);\n  };\n\n  function smallMulTo (self, num, out) {\n    out.negative = num.negative ^ self.negative;\n    var len = (self.length + num.length) | 0;\n    out.length = len;\n    len = (len - 1) | 0;\n\n    // Peel one iteration (compiler can't do it, because of code complexity)\n    var a = self.words[0] | 0;\n    var b = num.words[0] | 0;\n    var r = a * b;\n\n    var lo = r & 0x3ffffff;\n    var carry = (r / 0x4000000) | 0;\n    out.words[0] = lo;\n\n    for (var k = 1; k < len; k++) {\n      // Sum all words with the same `i + j = k` and accumulate `ncarry`,\n      // note that ncarry could be >= 0x3ffffff\n      var ncarry = carry >>> 26;\n      var rword = carry & 0x3ffffff;\n      var maxJ = Math.min(k, num.length - 1);\n      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {\n        var i = (k - j) | 0;\n        a = self.words[i] | 0;\n        b = num.words[j] | 0;\n        r = a * b + rword;\n        ncarry += (r / 0x4000000) | 0;\n        rword = r & 0x3ffffff;\n      }\n      out.words[k] = rword | 0;\n      carry = ncarry | 0;\n    }\n    if (carry !== 0) {\n      out.words[k] = carry | 0;\n    } else {\n      out.length--;\n    }\n\n    return out.strip();\n  }\n\n  // TODO(indutny): it may be reasonable to omit it for users who don't need\n  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit\n  // multiplication (like elliptic secp256k1).\n  var comb10MulTo = function comb10MulTo (self, num, out) {\n    var a = self.words;\n    var b = num.words;\n    var o = out.words;\n    var c = 0;\n    var lo;\n    var mid;\n    var hi;\n    var a0 = a[0] | 0;\n    var al0 = a0 & 0x1fff;\n    var ah0 = a0 >>> 13;\n    var a1 = a[1] | 0;\n    var al1 = a1 & 0x1fff;\n    var ah1 = a1 >>> 13;\n    var a2 = a[2] | 0;\n    var al2 = a2 & 0x1fff;\n    var ah2 = a2 >>> 13;\n    var a3 = a[3] | 0;\n    var al3 = a3 & 0x1fff;\n    var ah3 = a3 >>> 13;\n    var a4 = a[4] | 0;\n    var al4 = a4 & 0x1fff;\n    var ah4 = a4 >>> 13;\n    var a5 = a[5] | 0;\n    var al5 = a5 & 0x1fff;\n    var ah5 = a5 >>> 13;\n    var a6 = a[6] | 0;\n    var al6 = a6 & 0x1fff;\n    var ah6 = a6 >>> 13;\n    var a7 = a[7] | 0;\n    var al7 = a7 & 0x1fff;\n    var ah7 = a7 >>> 13;\n    var a8 = a[8] | 0;\n    var al8 = a8 & 0x1fff;\n    var ah8 = a8 >>> 13;\n    var a9 = a[9] | 0;\n    var al9 = a9 & 0x1fff;\n    var ah9 = a9 >>> 13;\n    var b0 = b[0] | 0;\n    var bl0 = b0 & 0x1fff;\n    var bh0 = b0 >>> 13;\n    var b1 = b[1] | 0;\n    var bl1 = b1 & 0x1fff;\n    var bh1 = b1 >>> 13;\n    var b2 = b[2] | 0;\n    var bl2 = b2 & 0x1fff;\n    var bh2 = b2 >>> 13;\n    var b3 = b[3] | 0;\n    var bl3 = b3 & 0x1fff;\n    var bh3 = b3 >>> 13;\n    var b4 = b[4] | 0;\n    var bl4 = b4 & 0x1fff;\n    var bh4 = b4 >>> 13;\n    var b5 = b[5] | 0;\n    var bl5 = b5 & 0x1fff;\n    var bh5 = b5 >>> 13;\n    var b6 = b[6] | 0;\n    var bl6 = b6 & 0x1fff;\n    var bh6 = b6 >>> 13;\n    var b7 = b[7] | 0;\n    var bl7 = b7 & 0x1fff;\n    var bh7 = b7 >>> 13;\n    var b8 = b[8] | 0;\n    var bl8 = b8 & 0x1fff;\n    var bh8 = b8 >>> 13;\n    var b9 = b[9] | 0;\n    var bl9 = b9 & 0x1fff;\n    var bh9 = b9 >>> 13;\n\n    out.negative = self.negative ^ num.negative;\n    out.length = 19;\n    /* k = 0 */\n    lo = Math.imul(al0, bl0);\n    mid = Math.imul(al0, bh0);\n    mid = (mid + Math.imul(ah0, bl0)) | 0;\n    hi = Math.imul(ah0, bh0);\n    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;\n    w0 &= 0x3ffffff;\n    /* k = 1 */\n    lo = Math.imul(al1, bl0);\n    mid = Math.imul(al1, bh0);\n    mid = (mid + Math.imul(ah1, bl0)) | 0;\n    hi = Math.imul(ah1, bh0);\n    lo = (lo + Math.imul(al0, bl1)) | 0;\n    mid = (mid + Math.imul(al0, bh1)) | 0;\n    mid = (mid + Math.imul(ah0, bl1)) | 0;\n    hi = (hi + Math.imul(ah0, bh1)) | 0;\n    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;\n    w1 &= 0x3ffffff;\n    /* k = 2 */\n    lo = Math.imul(al2, bl0);\n    mid = Math.imul(al2, bh0);\n    mid = (mid + Math.imul(ah2, bl0)) | 0;\n    hi = Math.imul(ah2, bh0);\n    lo = (lo + Math.imul(al1, bl1)) | 0;\n    mid = (mid + Math.imul(al1, bh1)) | 0;\n    mid = (mid + Math.imul(ah1, bl1)) | 0;\n    hi = (hi + Math.imul(ah1, bh1)) | 0;\n    lo = (lo + Math.imul(al0, bl2)) | 0;\n    mid = (mid + Math.imul(al0, bh2)) | 0;\n    mid = (mid + Math.imul(ah0, bl2)) | 0;\n    hi = (hi + Math.imul(ah0, bh2)) | 0;\n    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;\n    w2 &= 0x3ffffff;\n    /* k = 3 */\n    lo = Math.imul(al3, bl0);\n    mid = Math.imul(al3, bh0);\n    mid = (mid + Math.imul(ah3, bl0)) | 0;\n    hi = Math.imul(ah3, bh0);\n    lo = (lo + Math.imul(al2, bl1)) | 0;\n    mid = (mid + Math.imul(al2, bh1)) | 0;\n    mid = (mid + Math.imul(ah2, bl1)) | 0;\n    hi = (hi + Math.imul(ah2, bh1)) | 0;\n    lo = (lo + Math.imul(al1, bl2)) | 0;\n    mid = (mid + Math.imul(al1, bh2)) | 0;\n    mid = (mid + Math.imul(ah1, bl2)) | 0;\n    hi = (hi + Math.imul(ah1, bh2)) | 0;\n    lo = (lo + Math.imul(al0, bl3)) | 0;\n    mid = (mid + Math.imul(al0, bh3)) | 0;\n    mid = (mid + Math.imul(ah0, bl3)) | 0;\n    hi = (hi + Math.imul(ah0, bh3)) | 0;\n    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;\n    w3 &= 0x3ffffff;\n    /* k = 4 */\n    lo = Math.imul(al4, bl0);\n    mid = Math.imul(al4, bh0);\n    mid = (mid + Math.imul(ah4, bl0)) | 0;\n    hi = Math.imul(ah4, bh0);\n    lo = (lo + Math.imul(al3, bl1)) | 0;\n    mid = (mid + Math.imul(al3, bh1)) | 0;\n    mid = (mid + Math.imul(ah3, bl1)) | 0;\n    hi = (hi + Math.imul(ah3, bh1)) | 0;\n    lo = (lo + Math.imul(al2, bl2)) | 0;\n    mid = (mid + Math.imul(al2, bh2)) | 0;\n    mid = (mid + Math.imul(ah2, bl2)) | 0;\n    hi = (hi + Math.imul(ah2, bh2)) | 0;\n    lo = (lo + Math.imul(al1, bl3)) | 0;\n    mid = (mid + Math.imul(al1, bh3)) | 0;\n    mid = (mid + Math.imul(ah1, bl3)) | 0;\n    hi = (hi + Math.imul(ah1, bh3)) | 0;\n    lo = (lo + Math.imul(al0, bl4)) | 0;\n    mid = (mid + Math.imul(al0, bh4)) | 0;\n    mid = (mid + Math.imul(ah0, bl4)) | 0;\n    hi = (hi + Math.imul(ah0, bh4)) | 0;\n    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;\n    w4 &= 0x3ffffff;\n    /* k = 5 */\n    lo = Math.imul(al5, bl0);\n    mid = Math.imul(al5, bh0);\n    mid = (mid + Math.imul(ah5, bl0)) | 0;\n    hi = Math.imul(ah5, bh0);\n    lo = (lo + Math.imul(al4, bl1)) | 0;\n    mid = (mid + Math.imul(al4, bh1)) | 0;\n    mid = (mid + Math.imul(ah4, bl1)) | 0;\n    hi = (hi + Math.imul(ah4, bh1)) | 0;\n    lo = (lo + Math.imul(al3, bl2)) | 0;\n    mid = (mid + Math.imul(al3, bh2)) | 0;\n    mid = (mid + Math.imul(ah3, bl2)) | 0;\n    hi = (hi + Math.imul(ah3, bh2)) | 0;\n    lo = (lo + Math.imul(al2, bl3)) | 0;\n    mid = (mid + Math.imul(al2, bh3)) | 0;\n    mid = (mid + Math.imul(ah2, bl3)) | 0;\n    hi = (hi + Math.imul(ah2, bh3)) | 0;\n    lo = (lo + Math.imul(al1, bl4)) | 0;\n    mid = (mid + Math.imul(al1, bh4)) | 0;\n    mid = (mid + Math.imul(ah1, bl4)) | 0;\n    hi = (hi + Math.imul(ah1, bh4)) | 0;\n    lo = (lo + Math.imul(al0, bl5)) | 0;\n    mid = (mid + Math.imul(al0, bh5)) | 0;\n    mid = (mid + Math.imul(ah0, bl5)) | 0;\n    hi = (hi + Math.imul(ah0, bh5)) | 0;\n    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;\n    w5 &= 0x3ffffff;\n    /* k = 6 */\n    lo = Math.imul(al6, bl0);\n    mid = Math.imul(al6, bh0);\n    mid = (mid + Math.imul(ah6, bl0)) | 0;\n    hi = Math.imul(ah6, bh0);\n    lo = (lo + Math.imul(al5, bl1)) | 0;\n    mid = (mid + Math.imul(al5, bh1)) | 0;\n    mid = (mid + Math.imul(ah5, bl1)) | 0;\n    hi = (hi + Math.imul(ah5, bh1)) | 0;\n    lo = (lo + Math.imul(al4, bl2)) | 0;\n    mid = (mid + Math.imul(al4, bh2)) | 0;\n    mid = (mid + Math.imul(ah4, bl2)) | 0;\n    hi = (hi + Math.imul(ah4, bh2)) | 0;\n    lo = (lo + Math.imul(al3, bl3)) | 0;\n    mid = (mid + Math.imul(al3, bh3)) | 0;\n    mid = (mid + Math.imul(ah3, bl3)) | 0;\n    hi = (hi + Math.imul(ah3, bh3)) | 0;\n    lo = (lo + Math.imul(al2, bl4)) | 0;\n    mid = (mid + Math.imul(al2, bh4)) | 0;\n    mid = (mid + Math.imul(ah2, bl4)) | 0;\n    hi = (hi + Math.imul(ah2, bh4)) | 0;\n    lo = (lo + Math.imul(al1, bl5)) | 0;\n    mid = (mid + Math.imul(al1, bh5)) | 0;\n    mid = (mid + Math.imul(ah1, bl5)) | 0;\n    hi = (hi + Math.imul(ah1, bh5)) | 0;\n    lo = (lo + Math.imul(al0, bl6)) | 0;\n    mid = (mid + Math.imul(al0, bh6)) | 0;\n    mid = (mid + Math.imul(ah0, bl6)) | 0;\n    hi = (hi + Math.imul(ah0, bh6)) | 0;\n    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;\n    w6 &= 0x3ffffff;\n    /* k = 7 */\n    lo = Math.imul(al7, bl0);\n    mid = Math.imul(al7, bh0);\n    mid = (mid + Math.imul(ah7, bl0)) | 0;\n    hi = Math.imul(ah7, bh0);\n    lo = (lo + Math.imul(al6, bl1)) | 0;\n    mid = (mid + Math.imul(al6, bh1)) | 0;\n    mid = (mid + Math.imul(ah6, bl1)) | 0;\n    hi = (hi + Math.imul(ah6, bh1)) | 0;\n    lo = (lo + Math.imul(al5, bl2)) | 0;\n    mid = (mid + Math.imul(al5, bh2)) | 0;\n    mid = (mid + Math.imul(ah5, bl2)) | 0;\n    hi = (hi + Math.imul(ah5, bh2)) | 0;\n    lo = (lo + Math.imul(al4, bl3)) | 0;\n    mid = (mid + Math.imul(al4, bh3)) | 0;\n    mid = (mid + Math.imul(ah4, bl3)) | 0;\n    hi = (hi + Math.imul(ah4, bh3)) | 0;\n    lo = (lo + Math.imul(al3, bl4)) | 0;\n    mid = (mid + Math.imul(al3, bh4)) | 0;\n    mid = (mid + Math.imul(ah3, bl4)) | 0;\n    hi = (hi + Math.imul(ah3, bh4)) | 0;\n    lo = (lo + Math.imul(al2, bl5)) | 0;\n    mid = (mid + Math.imul(al2, bh5)) | 0;\n    mid = (mid + Math.imul(ah2, bl5)) | 0;\n    hi = (hi + Math.imul(ah2, bh5)) | 0;\n    lo = (lo + Math.imul(al1, bl6)) | 0;\n    mid = (mid + Math.imul(al1, bh6)) | 0;\n    mid = (mid + Math.imul(ah1, bl6)) | 0;\n    hi = (hi + Math.imul(ah1, bh6)) | 0;\n    lo = (lo + Math.imul(al0, bl7)) | 0;\n    mid = (mid + Math.imul(al0, bh7)) | 0;\n    mid = (mid + Math.imul(ah0, bl7)) | 0;\n    hi = (hi + Math.imul(ah0, bh7)) | 0;\n    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;\n    w7 &= 0x3ffffff;\n    /* k = 8 */\n    lo = Math.imul(al8, bl0);\n    mid = Math.imul(al8, bh0);\n    mid = (mid + Math.imul(ah8, bl0)) | 0;\n    hi = Math.imul(ah8, bh0);\n    lo = (lo + Math.imul(al7, bl1)) | 0;\n    mid = (mid + Math.imul(al7, bh1)) | 0;\n    mid = (mid + Math.imul(ah7, bl1)) | 0;\n    hi = (hi + Math.imul(ah7, bh1)) | 0;\n    lo = (lo + Math.imul(al6, bl2)) | 0;\n    mid = (mid + Math.imul(al6, bh2)) | 0;\n    mid = (mid + Math.imul(ah6, bl2)) | 0;\n    hi = (hi + Math.imul(ah6, bh2)) | 0;\n    lo = (lo + Math.imul(al5, bl3)) | 0;\n    mid = (mid + Math.imul(al5, bh3)) | 0;\n    mid = (mid + Math.imul(ah5, bl3)) | 0;\n    hi = (hi + Math.imul(ah5, bh3)) | 0;\n    lo = (lo + Math.imul(al4, bl4)) | 0;\n    mid = (mid + Math.imul(al4, bh4)) | 0;\n    mid = (mid + Math.imul(ah4, bl4)) | 0;\n    hi = (hi + Math.imul(ah4, bh4)) | 0;\n    lo = (lo + Math.imul(al3, bl5)) | 0;\n    mid = (mid + Math.imul(al3, bh5)) | 0;\n    mid = (mid + Math.imul(ah3, bl5)) | 0;\n    hi = (hi + Math.imul(ah3, bh5)) | 0;\n    lo = (lo + Math.imul(al2, bl6)) | 0;\n    mid = (mid + Math.imul(al2, bh6)) | 0;\n    mid = (mid + Math.imul(ah2, bl6)) | 0;\n    hi = (hi + Math.imul(ah2, bh6)) | 0;\n    lo = (lo + Math.imul(al1, bl7)) | 0;\n    mid = (mid + Math.imul(al1, bh7)) | 0;\n    mid = (mid + Math.imul(ah1, bl7)) | 0;\n    hi = (hi + Math.imul(ah1, bh7)) | 0;\n    lo = (lo + Math.imul(al0, bl8)) | 0;\n    mid = (mid + Math.imul(al0, bh8)) | 0;\n    mid = (mid + Math.imul(ah0, bl8)) | 0;\n    hi = (hi + Math.imul(ah0, bh8)) | 0;\n    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;\n    w8 &= 0x3ffffff;\n    /* k = 9 */\n    lo = Math.imul(al9, bl0);\n    mid = Math.imul(al9, bh0);\n    mid = (mid + Math.imul(ah9, bl0)) | 0;\n    hi = Math.imul(ah9, bh0);\n    lo = (lo + Math.imul(al8, bl1)) | 0;\n    mid = (mid + Math.imul(al8, bh1)) | 0;\n    mid = (mid + Math.imul(ah8, bl1)) | 0;\n    hi = (hi + Math.imul(ah8, bh1)) | 0;\n    lo = (lo + Math.imul(al7, bl2)) | 0;\n    mid = (mid + Math.imul(al7, bh2)) | 0;\n    mid = (mid + Math.imul(ah7, bl2)) | 0;\n    hi = (hi + Math.imul(ah7, bh2)) | 0;\n    lo = (lo + Math.imul(al6, bl3)) | 0;\n    mid = (mid + Math.imul(al6, bh3)) | 0;\n    mid = (mid + Math.imul(ah6, bl3)) | 0;\n    hi = (hi + Math.imul(ah6, bh3)) | 0;\n    lo = (lo + Math.imul(al5, bl4)) | 0;\n    mid = (mid + Math.imul(al5, bh4)) | 0;\n    mid = (mid + Math.imul(ah5, bl4)) | 0;\n    hi = (hi + Math.imul(ah5, bh4)) | 0;\n    lo = (lo + Math.imul(al4, bl5)) | 0;\n    mid = (mid + Math.imul(al4, bh5)) | 0;\n    mid = (mid + Math.imul(ah4, bl5)) | 0;\n    hi = (hi + Math.imul(ah4, bh5)) | 0;\n    lo = (lo + Math.imul(al3, bl6)) | 0;\n    mid = (mid + Math.imul(al3, bh6)) | 0;\n    mid = (mid + Math.imul(ah3, bl6)) | 0;\n    hi = (hi + Math.imul(ah3, bh6)) | 0;\n    lo = (lo + Math.imul(al2, bl7)) | 0;\n    mid = (mid + Math.imul(al2, bh7)) | 0;\n    mid = (mid + Math.imul(ah2, bl7)) | 0;\n    hi = (hi + Math.imul(ah2, bh7)) | 0;\n    lo = (lo + Math.imul(al1, bl8)) | 0;\n    mid = (mid + Math.imul(al1, bh8)) | 0;\n    mid = (mid + Math.imul(ah1, bl8)) | 0;\n    hi = (hi + Math.imul(ah1, bh8)) | 0;\n    lo = (lo + Math.imul(al0, bl9)) | 0;\n    mid = (mid + Math.imul(al0, bh9)) | 0;\n    mid = (mid + Math.imul(ah0, bl9)) | 0;\n    hi = (hi + Math.imul(ah0, bh9)) | 0;\n    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;\n    w9 &= 0x3ffffff;\n    /* k = 10 */\n    lo = Math.imul(al9, bl1);\n    mid = Math.imul(al9, bh1);\n    mid = (mid + Math.imul(ah9, bl1)) | 0;\n    hi = Math.imul(ah9, bh1);\n    lo = (lo + Math.imul(al8, bl2)) | 0;\n    mid = (mid + Math.imul(al8, bh2)) | 0;\n    mid = (mid + Math.imul(ah8, bl2)) | 0;\n    hi = (hi + Math.imul(ah8, bh2)) | 0;\n    lo = (lo + Math.imul(al7, bl3)) | 0;\n    mid = (mid + Math.imul(al7, bh3)) | 0;\n    mid = (mid + Math.imul(ah7, bl3)) | 0;\n    hi = (hi + Math.imul(ah7, bh3)) | 0;\n    lo = (lo + Math.imul(al6, bl4)) | 0;\n    mid = (mid + Math.imul(al6, bh4)) | 0;\n    mid = (mid + Math.imul(ah6, bl4)) | 0;\n    hi = (hi + Math.imul(ah6, bh4)) | 0;\n    lo = (lo + Math.imul(al5, bl5)) | 0;\n    mid = (mid + Math.imul(al5, bh5)) | 0;\n    mid = (mid + Math.imul(ah5, bl5)) | 0;\n    hi = (hi + Math.imul(ah5, bh5)) | 0;\n    lo = (lo + Math.imul(al4, bl6)) | 0;\n    mid = (mid + Math.imul(al4, bh6)) | 0;\n    mid = (mid + Math.imul(ah4, bl6)) | 0;\n    hi = (hi + Math.imul(ah4, bh6)) | 0;\n    lo = (lo + Math.imul(al3, bl7)) | 0;\n    mid = (mid + Math.imul(al3, bh7)) | 0;\n    mid = (mid + Math.imul(ah3, bl7)) | 0;\n    hi = (hi + Math.imul(ah3, bh7)) | 0;\n    lo = (lo + Math.imul(al2, bl8)) | 0;\n    mid = (mid + Math.imul(al2, bh8)) | 0;\n    mid = (mid + Math.imul(ah2, bl8)) | 0;\n    hi = (hi + Math.imul(ah2, bh8)) | 0;\n    lo = (lo + Math.imul(al1, bl9)) | 0;\n    mid = (mid + Math.imul(al1, bh9)) | 0;\n    mid = (mid + Math.imul(ah1, bl9)) | 0;\n    hi = (hi + Math.imul(ah1, bh9)) | 0;\n    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;\n    w10 &= 0x3ffffff;\n    /* k = 11 */\n    lo = Math.imul(al9, bl2);\n    mid = Math.imul(al9, bh2);\n    mid = (mid + Math.imul(ah9, bl2)) | 0;\n    hi = Math.imul(ah9, bh2);\n    lo = (lo + Math.imul(al8, bl3)) | 0;\n    mid = (mid + Math.imul(al8, bh3)) | 0;\n    mid = (mid + Math.imul(ah8, bl3)) | 0;\n    hi = (hi + Math.imul(ah8, bh3)) | 0;\n    lo = (lo + Math.imul(al7, bl4)) | 0;\n    mid = (mid + Math.imul(al7, bh4)) | 0;\n    mid = (mid + Math.imul(ah7, bl4)) | 0;\n    hi = (hi + Math.imul(ah7, bh4)) | 0;\n    lo = (lo + Math.imul(al6, bl5)) | 0;\n    mid = (mid + Math.imul(al6, bh5)) | 0;\n    mid = (mid + Math.imul(ah6, bl5)) | 0;\n    hi = (hi + Math.imul(ah6, bh5)) | 0;\n    lo = (lo + Math.imul(al5, bl6)) | 0;\n    mid = (mid + Math.imul(al5, bh6)) | 0;\n    mid = (mid + Math.imul(ah5, bl6)) | 0;\n    hi = (hi + Math.imul(ah5, bh6)) | 0;\n    lo = (lo + Math.imul(al4, bl7)) | 0;\n    mid = (mid + Math.imul(al4, bh7)) | 0;\n    mid = (mid + Math.imul(ah4, bl7)) | 0;\n    hi = (hi + Math.imul(ah4, bh7)) | 0;\n    lo = (lo + Math.imul(al3, bl8)) | 0;\n    mid = (mid + Math.imul(al3, bh8)) | 0;\n    mid = (mid + Math.imul(ah3, bl8)) | 0;\n    hi = (hi + Math.imul(ah3, bh8)) | 0;\n    lo = (lo + Math.imul(al2, bl9)) | 0;\n    mid = (mid + Math.imul(al2, bh9)) | 0;\n    mid = (mid + Math.imul(ah2, bl9)) | 0;\n    hi = (hi + Math.imul(ah2, bh9)) | 0;\n    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;\n    w11 &= 0x3ffffff;\n    /* k = 12 */\n    lo = Math.imul(al9, bl3);\n    mid = Math.imul(al9, bh3);\n    mid = (mid + Math.imul(ah9, bl3)) | 0;\n    hi = Math.imul(ah9, bh3);\n    lo = (lo + Math.imul(al8, bl4)) | 0;\n    mid = (mid + Math.imul(al8, bh4)) | 0;\n    mid = (mid + Math.imul(ah8, bl4)) | 0;\n    hi = (hi + Math.imul(ah8, bh4)) | 0;\n    lo = (lo + Math.imul(al7, bl5)) | 0;\n    mid = (mid + Math.imul(al7, bh5)) | 0;\n    mid = (mid + Math.imul(ah7, bl5)) | 0;\n    hi = (hi + Math.imul(ah7, bh5)) | 0;\n    lo = (lo + Math.imul(al6, bl6)) | 0;\n    mid = (mid + Math.imul(al6, bh6)) | 0;\n    mid = (mid + Math.imul(ah6, bl6)) | 0;\n    hi = (hi + Math.imul(ah6, bh6)) | 0;\n    lo = (lo + Math.imul(al5, bl7)) | 0;\n    mid = (mid + Math.imul(al5, bh7)) | 0;\n    mid = (mid + Math.imul(ah5, bl7)) | 0;\n    hi = (hi + Math.imul(ah5, bh7)) | 0;\n    lo = (lo + Math.imul(al4, bl8)) | 0;\n    mid = (mid + Math.imul(al4, bh8)) | 0;\n    mid = (mid + Math.imul(ah4, bl8)) | 0;\n    hi = (hi + Math.imul(ah4, bh8)) | 0;\n    lo = (lo + Math.imul(al3, bl9)) | 0;\n    mid = (mid + Math.imul(al3, bh9)) | 0;\n    mid = (mid + Math.imul(ah3, bl9)) | 0;\n    hi = (hi + Math.imul(ah3, bh9)) | 0;\n    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;\n    w12 &= 0x3ffffff;\n    /* k = 13 */\n    lo = Math.imul(al9, bl4);\n    mid = Math.imul(al9, bh4);\n    mid = (mid + Math.imul(ah9, bl4)) | 0;\n    hi = Math.imul(ah9, bh4);\n    lo = (lo + Math.imul(al8, bl5)) | 0;\n    mid = (mid + Math.imul(al8, bh5)) | 0;\n    mid = (mid + Math.imul(ah8, bl5)) | 0;\n    hi = (hi + Math.imul(ah8, bh5)) | 0;\n    lo = (lo + Math.imul(al7, bl6)) | 0;\n    mid = (mid + Math.imul(al7, bh6)) | 0;\n    mid = (mid + Math.imul(ah7, bl6)) | 0;\n    hi = (hi + Math.imul(ah7, bh6)) | 0;\n    lo = (lo + Math.imul(al6, bl7)) | 0;\n    mid = (mid + Math.imul(al6, bh7)) | 0;\n    mid = (mid + Math.imul(ah6, bl7)) | 0;\n    hi = (hi + Math.imul(ah6, bh7)) | 0;\n    lo = (lo + Math.imul(al5, bl8)) | 0;\n    mid = (mid + Math.imul(al5, bh8)) | 0;\n    mid = (mid + Math.imul(ah5, bl8)) | 0;\n    hi = (hi + Math.imul(ah5, bh8)) | 0;\n    lo = (lo + Math.imul(al4, bl9)) | 0;\n    mid = (mid + Math.imul(al4, bh9)) | 0;\n    mid = (mid + Math.imul(ah4, bl9)) | 0;\n    hi = (hi + Math.imul(ah4, bh9)) | 0;\n    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;\n    w13 &= 0x3ffffff;\n    /* k = 14 */\n    lo = Math.imul(al9, bl5);\n    mid = Math.imul(al9, bh5);\n    mid = (mid + Math.imul(ah9, bl5)) | 0;\n    hi = Math.imul(ah9, bh5);\n    lo = (lo + Math.imul(al8, bl6)) | 0;\n    mid = (mid + Math.imul(al8, bh6)) | 0;\n    mid = (mid + Math.imul(ah8, bl6)) | 0;\n    hi = (hi + Math.imul(ah8, bh6)) | 0;\n    lo = (lo + Math.imul(al7, bl7)) | 0;\n    mid = (mid + Math.imul(al7, bh7)) | 0;\n    mid = (mid + Math.imul(ah7, bl7)) | 0;\n    hi = (hi + Math.imul(ah7, bh7)) | 0;\n    lo = (lo + Math.imul(al6, bl8)) | 0;\n    mid = (mid + Math.imul(al6, bh8)) | 0;\n    mid = (mid + Math.imul(ah6, bl8)) | 0;\n    hi = (hi + Math.imul(ah6, bh8)) | 0;\n    lo = (lo + Math.imul(al5, bl9)) | 0;\n    mid = (mid + Math.imul(al5, bh9)) | 0;\n    mid = (mid + Math.imul(ah5, bl9)) | 0;\n    hi = (hi + Math.imul(ah5, bh9)) | 0;\n    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;\n    w14 &= 0x3ffffff;\n    /* k = 15 */\n    lo = Math.imul(al9, bl6);\n    mid = Math.imul(al9, bh6);\n    mid = (mid + Math.imul(ah9, bl6)) | 0;\n    hi = Math.imul(ah9, bh6);\n    lo = (lo + Math.imul(al8, bl7)) | 0;\n    mid = (mid + Math.imul(al8, bh7)) | 0;\n    mid = (mid + Math.imul(ah8, bl7)) | 0;\n    hi = (hi + Math.imul(ah8, bh7)) | 0;\n    lo = (lo + Math.imul(al7, bl8)) | 0;\n    mid = (mid + Math.imul(al7, bh8)) | 0;\n    mid = (mid + Math.imul(ah7, bl8)) | 0;\n    hi = (hi + Math.imul(ah7, bh8)) | 0;\n    lo = (lo + Math.imul(al6, bl9)) | 0;\n    mid = (mid + Math.imul(al6, bh9)) | 0;\n    mid = (mid + Math.imul(ah6, bl9)) | 0;\n    hi = (hi + Math.imul(ah6, bh9)) | 0;\n    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;\n    w15 &= 0x3ffffff;\n    /* k = 16 */\n    lo = Math.imul(al9, bl7);\n    mid = Math.imul(al9, bh7);\n    mid = (mid + Math.imul(ah9, bl7)) | 0;\n    hi = Math.imul(ah9, bh7);\n    lo = (lo + Math.imul(al8, bl8)) | 0;\n    mid = (mid + Math.imul(al8, bh8)) | 0;\n    mid = (mid + Math.imul(ah8, bl8)) | 0;\n    hi = (hi + Math.imul(ah8, bh8)) | 0;\n    lo = (lo + Math.imul(al7, bl9)) | 0;\n    mid = (mid + Math.imul(al7, bh9)) | 0;\n    mid = (mid + Math.imul(ah7, bl9)) | 0;\n    hi = (hi + Math.imul(ah7, bh9)) | 0;\n    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;\n    w16 &= 0x3ffffff;\n    /* k = 17 */\n    lo = Math.imul(al9, bl8);\n    mid = Math.imul(al9, bh8);\n    mid = (mid + Math.imul(ah9, bl8)) | 0;\n    hi = Math.imul(ah9, bh8);\n    lo = (lo + Math.imul(al8, bl9)) | 0;\n    mid = (mid + Math.imul(al8, bh9)) | 0;\n    mid = (mid + Math.imul(ah8, bl9)) | 0;\n    hi = (hi + Math.imul(ah8, bh9)) | 0;\n    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;\n    w17 &= 0x3ffffff;\n    /* k = 18 */\n    lo = Math.imul(al9, bl9);\n    mid = Math.imul(al9, bh9);\n    mid = (mid + Math.imul(ah9, bl9)) | 0;\n    hi = Math.imul(ah9, bh9);\n    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;\n    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;\n    w18 &= 0x3ffffff;\n    o[0] = w0;\n    o[1] = w1;\n    o[2] = w2;\n    o[3] = w3;\n    o[4] = w4;\n    o[5] = w5;\n    o[6] = w6;\n    o[7] = w7;\n    o[8] = w8;\n    o[9] = w9;\n    o[10] = w10;\n    o[11] = w11;\n    o[12] = w12;\n    o[13] = w13;\n    o[14] = w14;\n    o[15] = w15;\n    o[16] = w16;\n    o[17] = w17;\n    o[18] = w18;\n    if (c !== 0) {\n      o[19] = c;\n      out.length++;\n    }\n    return out;\n  };\n\n  // Polyfill comb\n  if (!Math.imul) {\n    comb10MulTo = smallMulTo;\n  }\n\n  function bigMulTo (self, num, out) {\n    out.negative = num.negative ^ self.negative;\n    out.length = self.length + num.length;\n\n    var carry = 0;\n    var hncarry = 0;\n    for (var k = 0; k < out.length - 1; k++) {\n      // Sum all words with the same `i + j = k` and accumulate `ncarry`,\n      // note that ncarry could be >= 0x3ffffff\n      var ncarry = hncarry;\n      hncarry = 0;\n      var rword = carry & 0x3ffffff;\n      var maxJ = Math.min(k, num.length - 1);\n      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {\n        var i = k - j;\n        var a = self.words[i] | 0;\n        var b = num.words[j] | 0;\n        var r = a * b;\n\n        var lo = r & 0x3ffffff;\n        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;\n        lo = (lo + rword) | 0;\n        rword = lo & 0x3ffffff;\n        ncarry = (ncarry + (lo >>> 26)) | 0;\n\n        hncarry += ncarry >>> 26;\n        ncarry &= 0x3ffffff;\n      }\n      out.words[k] = rword;\n      carry = ncarry;\n      ncarry = hncarry;\n    }\n    if (carry !== 0) {\n      out.words[k] = carry;\n    } else {\n      out.length--;\n    }\n\n    return out.strip();\n  }\n\n  function jumboMulTo (self, num, out) {\n    var fftm = new FFTM();\n    return fftm.mulp(self, num, out);\n  }\n\n  BN.prototype.mulTo = function mulTo (num, out) {\n    var res;\n    var len = this.length + num.length;\n    if (this.length === 10 && num.length === 10) {\n      res = comb10MulTo(this, num, out);\n    } else if (len < 63) {\n      res = smallMulTo(this, num, out);\n    } else if (len < 1024) {\n      res = bigMulTo(this, num, out);\n    } else {\n      res = jumboMulTo(this, num, out);\n    }\n\n    return res;\n  };\n\n  // Cooley-Tukey algorithm for FFT\n  // slightly revisited to rely on looping instead of recursion\n\n  function FFTM (x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  FFTM.prototype.makeRBT = function makeRBT (N) {\n    var t = new Array(N);\n    var l = BN.prototype._countBits(N) - 1;\n    for (var i = 0; i < N; i++) {\n      t[i] = this.revBin(i, l, N);\n    }\n\n    return t;\n  };\n\n  // Returns binary-reversed representation of `x`\n  FFTM.prototype.revBin = function revBin (x, l, N) {\n    if (x === 0 || x === N - 1) return x;\n\n    var rb = 0;\n    for (var i = 0; i < l; i++) {\n      rb |= (x & 1) << (l - i - 1);\n      x >>= 1;\n    }\n\n    return rb;\n  };\n\n  // Performs \"tweedling\" phase, therefore 'emulating'\n  // behaviour of the recursive algorithm\n  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {\n    for (var i = 0; i < N; i++) {\n      rtws[i] = rws[rbt[i]];\n      itws[i] = iws[rbt[i]];\n    }\n  };\n\n  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {\n    this.permute(rbt, rws, iws, rtws, itws, N);\n\n    for (var s = 1; s < N; s <<= 1) {\n      var l = s << 1;\n\n      var rtwdf = Math.cos(2 * Math.PI / l);\n      var itwdf = Math.sin(2 * Math.PI / l);\n\n      for (var p = 0; p < N; p += l) {\n        var rtwdf_ = rtwdf;\n        var itwdf_ = itwdf;\n\n        for (var j = 0; j < s; j++) {\n          var re = rtws[p + j];\n          var ie = itws[p + j];\n\n          var ro = rtws[p + j + s];\n          var io = itws[p + j + s];\n\n          var rx = rtwdf_ * ro - itwdf_ * io;\n\n          io = rtwdf_ * io + itwdf_ * ro;\n          ro = rx;\n\n          rtws[p + j] = re + ro;\n          itws[p + j] = ie + io;\n\n          rtws[p + j + s] = re - ro;\n          itws[p + j + s] = ie - io;\n\n          /* jshint maxdepth : false */\n          if (j !== l) {\n            rx = rtwdf * rtwdf_ - itwdf * itwdf_;\n\n            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;\n            rtwdf_ = rx;\n          }\n        }\n      }\n    }\n  };\n\n  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {\n    var N = Math.max(m, n) | 1;\n    var odd = N & 1;\n    var i = 0;\n    for (N = N / 2 | 0; N; N = N >>> 1) {\n      i++;\n    }\n\n    return 1 << i + 1 + odd;\n  };\n\n  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {\n    if (N <= 1) return;\n\n    for (var i = 0; i < N / 2; i++) {\n      var t = rws[i];\n\n      rws[i] = rws[N - i - 1];\n      rws[N - i - 1] = t;\n\n      t = iws[i];\n\n      iws[i] = -iws[N - i - 1];\n      iws[N - i - 1] = -t;\n    }\n  };\n\n  FFTM.prototype.normalize13b = function normalize13b (ws, N) {\n    var carry = 0;\n    for (var i = 0; i < N / 2; i++) {\n      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +\n        Math.round(ws[2 * i] / N) +\n        carry;\n\n      ws[i] = w & 0x3ffffff;\n\n      if (w < 0x4000000) {\n        carry = 0;\n      } else {\n        carry = w / 0x4000000 | 0;\n      }\n    }\n\n    return ws;\n  };\n\n  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {\n    var carry = 0;\n    for (var i = 0; i < len; i++) {\n      carry = carry + (ws[i] | 0);\n\n      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;\n      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;\n    }\n\n    // Pad with zeroes\n    for (i = 2 * len; i < N; ++i) {\n      rws[i] = 0;\n    }\n\n    assert(carry === 0);\n    assert((carry & ~0x1fff) === 0);\n  };\n\n  FFTM.prototype.stub = function stub (N) {\n    var ph = new Array(N);\n    for (var i = 0; i < N; i++) {\n      ph[i] = 0;\n    }\n\n    return ph;\n  };\n\n  FFTM.prototype.mulp = function mulp (x, y, out) {\n    var N = 2 * this.guessLen13b(x.length, y.length);\n\n    var rbt = this.makeRBT(N);\n\n    var _ = this.stub(N);\n\n    var rws = new Array(N);\n    var rwst = new Array(N);\n    var iwst = new Array(N);\n\n    var nrws = new Array(N);\n    var nrwst = new Array(N);\n    var niwst = new Array(N);\n\n    var rmws = out.words;\n    rmws.length = N;\n\n    this.convert13b(x.words, x.length, rws, N);\n    this.convert13b(y.words, y.length, nrws, N);\n\n    this.transform(rws, _, rwst, iwst, N, rbt);\n    this.transform(nrws, _, nrwst, niwst, N, rbt);\n\n    for (var i = 0; i < N; i++) {\n      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];\n      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];\n      rwst[i] = rx;\n    }\n\n    this.conjugate(rwst, iwst, N);\n    this.transform(rwst, iwst, rmws, _, N, rbt);\n    this.conjugate(rmws, _, N);\n    this.normalize13b(rmws, N);\n\n    out.negative = x.negative ^ y.negative;\n    out.length = x.length + y.length;\n    return out.strip();\n  };\n\n  // Multiply `this` by `num`\n  BN.prototype.mul = function mul (num) {\n    var out = new BN(null);\n    out.words = new Array(this.length + num.length);\n    return this.mulTo(num, out);\n  };\n\n  // Multiply employing FFT\n  BN.prototype.mulf = function mulf (num) {\n    var out = new BN(null);\n    out.words = new Array(this.length + num.length);\n    return jumboMulTo(this, num, out);\n  };\n\n  // In-place Multiplication\n  BN.prototype.imul = function imul (num) {\n    return this.clone().mulTo(num, this);\n  };\n\n  BN.prototype.imuln = function imuln (num) {\n    assert(typeof num === 'number');\n    assert(num < 0x4000000);\n\n    // Carry\n    var carry = 0;\n    for (var i = 0; i < this.length; i++) {\n      var w = (this.words[i] | 0) * num;\n      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);\n      carry >>= 26;\n      carry += (w / 0x4000000) | 0;\n      // NOTE: lo is 27bit maximum\n      carry += lo >>> 26;\n      this.words[i] = lo & 0x3ffffff;\n    }\n\n    if (carry !== 0) {\n      this.words[i] = carry;\n      this.length++;\n    }\n\n    return this;\n  };\n\n  BN.prototype.muln = function muln (num) {\n    return this.clone().imuln(num);\n  };\n\n  // `this` * `this`\n  BN.prototype.sqr = function sqr () {\n    return this.mul(this);\n  };\n\n  // `this` * `this` in-place\n  BN.prototype.isqr = function isqr () {\n    return this.imul(this.clone());\n  };\n\n  // Math.pow(`this`, `num`)\n  BN.prototype.pow = function pow (num) {\n    var w = toBitArray(num);\n    if (w.length === 0) return new BN(1);\n\n    // Skip leading zeroes\n    var res = this;\n    for (var i = 0; i < w.length; i++, res = res.sqr()) {\n      if (w[i] !== 0) break;\n    }\n\n    if (++i < w.length) {\n      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {\n        if (w[i] === 0) continue;\n\n        res = res.mul(q);\n      }\n    }\n\n    return res;\n  };\n\n  // Shift-left in-place\n  BN.prototype.iushln = function iushln (bits) {\n    assert(typeof bits === 'number' && bits >= 0);\n    var r = bits % 26;\n    var s = (bits - r) / 26;\n    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);\n    var i;\n\n    if (r !== 0) {\n      var carry = 0;\n\n      for (i = 0; i < this.length; i++) {\n        var newCarry = this.words[i] & carryMask;\n        var c = ((this.words[i] | 0) - newCarry) << r;\n        this.words[i] = c | carry;\n        carry = newCarry >>> (26 - r);\n      }\n\n      if (carry) {\n        this.words[i] = carry;\n        this.length++;\n      }\n    }\n\n    if (s !== 0) {\n      for (i = this.length - 1; i >= 0; i--) {\n        this.words[i + s] = this.words[i];\n      }\n\n      for (i = 0; i < s; i++) {\n        this.words[i] = 0;\n      }\n\n      this.length += s;\n    }\n\n    return this.strip();\n  };\n\n  BN.prototype.ishln = function ishln (bits) {\n    // TODO(indutny): implement me\n    assert(this.negative === 0);\n    return this.iushln(bits);\n  };\n\n  // Shift-right in-place\n  // NOTE: `hint` is a lowest bit before trailing zeroes\n  // NOTE: if `extended` is present - it will be filled with destroyed bits\n  BN.prototype.iushrn = function iushrn (bits, hint, extended) {\n    assert(typeof bits === 'number' && bits >= 0);\n    var h;\n    if (hint) {\n      h = (hint - (hint % 26)) / 26;\n    } else {\n      h = 0;\n    }\n\n    var r = bits % 26;\n    var s = Math.min((bits - r) / 26, this.length);\n    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);\n    var maskedWords = extended;\n\n    h -= s;\n    h = Math.max(0, h);\n\n    // Extended mode, copy masked part\n    if (maskedWords) {\n      for (var i = 0; i < s; i++) {\n        maskedWords.words[i] = this.words[i];\n      }\n      maskedWords.length = s;\n    }\n\n    if (s === 0) {\n      // No-op, we should not move anything at all\n    } else if (this.length > s) {\n      this.length -= s;\n      for (i = 0; i < this.length; i++) {\n        this.words[i] = this.words[i + s];\n      }\n    } else {\n      this.words[0] = 0;\n      this.length = 1;\n    }\n\n    var carry = 0;\n    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {\n      var word = this.words[i] | 0;\n      this.words[i] = (carry << (26 - r)) | (word >>> r);\n      carry = word & mask;\n    }\n\n    // Push carried bits as a mask\n    if (maskedWords && carry !== 0) {\n      maskedWords.words[maskedWords.length++] = carry;\n    }\n\n    if (this.length === 0) {\n      this.words[0] = 0;\n      this.length = 1;\n    }\n\n    return this.strip();\n  };\n\n  BN.prototype.ishrn = function ishrn (bits, hint, extended) {\n    // TODO(indutny): implement me\n    assert(this.negative === 0);\n    return this.iushrn(bits, hint, extended);\n  };\n\n  // Shift-left\n  BN.prototype.shln = function shln (bits) {\n    return this.clone().ishln(bits);\n  };\n\n  BN.prototype.ushln = function ushln (bits) {\n    return this.clone().iushln(bits);\n  };\n\n  // Shift-right\n  BN.prototype.shrn = function shrn (bits) {\n    return this.clone().ishrn(bits);\n  };\n\n  BN.prototype.ushrn = function ushrn (bits) {\n    return this.clone().iushrn(bits);\n  };\n\n  // Test if n bit is set\n  BN.prototype.testn = function testn (bit) {\n    assert(typeof bit === 'number' && bit >= 0);\n    var r = bit % 26;\n    var s = (bit - r) / 26;\n    var q = 1 << r;\n\n    // Fast case: bit is much higher than all existing words\n    if (this.length <= s) return false;\n\n    // Check bit and return\n    var w = this.words[s];\n\n    return !!(w & q);\n  };\n\n  // Return only lowers bits of number (in-place)\n  BN.prototype.imaskn = function imaskn (bits) {\n    assert(typeof bits === 'number' && bits >= 0);\n    var r = bits % 26;\n    var s = (bits - r) / 26;\n\n    assert(this.negative === 0, 'imaskn works only with positive numbers');\n\n    if (this.length <= s) {\n      return this;\n    }\n\n    if (r !== 0) {\n      s++;\n    }\n    this.length = Math.min(s, this.length);\n\n    if (r !== 0) {\n      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);\n      this.words[this.length - 1] &= mask;\n    }\n\n    return this.strip();\n  };\n\n  // Return only lowers bits of number\n  BN.prototype.maskn = function maskn (bits) {\n    return this.clone().imaskn(bits);\n  };\n\n  // Add plain number `num` to `this`\n  BN.prototype.iaddn = function iaddn (num) {\n    assert(typeof num === 'number');\n    assert(num < 0x4000000);\n    if (num < 0) return this.isubn(-num);\n\n    // Possible sign change\n    if (this.negative !== 0) {\n      if (this.length === 1 && (this.words[0] | 0) < num) {\n        this.words[0] = num - (this.words[0] | 0);\n        this.negative = 0;\n        return this;\n      }\n\n      this.negative = 0;\n      this.isubn(num);\n      this.negative = 1;\n      return this;\n    }\n\n    // Add without checks\n    return this._iaddn(num);\n  };\n\n  BN.prototype._iaddn = function _iaddn (num) {\n    this.words[0] += num;\n\n    // Carry\n    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {\n      this.words[i] -= 0x4000000;\n      if (i === this.length - 1) {\n        this.words[i + 1] = 1;\n      } else {\n        this.words[i + 1]++;\n      }\n    }\n    this.length = Math.max(this.length, i + 1);\n\n    return this;\n  };\n\n  // Subtract plain number `num` from `this`\n  BN.prototype.isubn = function isubn (num) {\n    assert(typeof num === 'number');\n    assert(num < 0x4000000);\n    if (num < 0) return this.iaddn(-num);\n\n    if (this.negative !== 0) {\n      this.negative = 0;\n      this.iaddn(num);\n      this.negative = 1;\n      return this;\n    }\n\n    this.words[0] -= num;\n\n    if (this.length === 1 && this.words[0] < 0) {\n      this.words[0] = -this.words[0];\n      this.negative = 1;\n    } else {\n      // Carry\n      for (var i = 0; i < this.length && this.words[i] < 0; i++) {\n        this.words[i] += 0x4000000;\n        this.words[i + 1] -= 1;\n      }\n    }\n\n    return this.strip();\n  };\n\n  BN.prototype.addn = function addn (num) {\n    return this.clone().iaddn(num);\n  };\n\n  BN.prototype.subn = function subn (num) {\n    return this.clone().isubn(num);\n  };\n\n  BN.prototype.iabs = function iabs () {\n    this.negative = 0;\n\n    return this;\n  };\n\n  BN.prototype.abs = function abs () {\n    return this.clone().iabs();\n  };\n\n  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {\n    var len = num.length + shift;\n    var i;\n\n    this._expand(len);\n\n    var w;\n    var carry = 0;\n    for (i = 0; i < num.length; i++) {\n      w = (this.words[i + shift] | 0) + carry;\n      var right = (num.words[i] | 0) * mul;\n      w -= right & 0x3ffffff;\n      carry = (w >> 26) - ((right / 0x4000000) | 0);\n      this.words[i + shift] = w & 0x3ffffff;\n    }\n    for (; i < this.length - shift; i++) {\n      w = (this.words[i + shift] | 0) + carry;\n      carry = w >> 26;\n      this.words[i + shift] = w & 0x3ffffff;\n    }\n\n    if (carry === 0) return this.strip();\n\n    // Subtraction overflow\n    assert(carry === -1);\n    carry = 0;\n    for (i = 0; i < this.length; i++) {\n      w = -(this.words[i] | 0) + carry;\n      carry = w >> 26;\n      this.words[i] = w & 0x3ffffff;\n    }\n    this.negative = 1;\n\n    return this.strip();\n  };\n\n  BN.prototype._wordDiv = function _wordDiv (num, mode) {\n    var shift = this.length - num.length;\n\n    var a = this.clone();\n    var b = num;\n\n    // Normalize\n    var bhi = b.words[b.length - 1] | 0;\n    var bhiBits = this._countBits(bhi);\n    shift = 26 - bhiBits;\n    if (shift !== 0) {\n      b = b.ushln(shift);\n      a.iushln(shift);\n      bhi = b.words[b.length - 1] | 0;\n    }\n\n    // Initialize quotient\n    var m = a.length - b.length;\n    var q;\n\n    if (mode !== 'mod') {\n      q = new BN(null);\n      q.length = m + 1;\n      q.words = new Array(q.length);\n      for (var i = 0; i < q.length; i++) {\n        q.words[i] = 0;\n      }\n    }\n\n    var diff = a.clone()._ishlnsubmul(b, 1, m);\n    if (diff.negative === 0) {\n      a = diff;\n      if (q) {\n        q.words[m] = 1;\n      }\n    }\n\n    for (var j = m - 1; j >= 0; j--) {\n      var qj = (a.words[b.length + j] | 0) * 0x4000000 +\n        (a.words[b.length + j - 1] | 0);\n\n      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max\n      // (0x7ffffff)\n      qj = Math.min((qj / bhi) | 0, 0x3ffffff);\n\n      a._ishlnsubmul(b, qj, j);\n      while (a.negative !== 0) {\n        qj--;\n        a.negative = 0;\n        a._ishlnsubmul(b, 1, j);\n        if (!a.isZero()) {\n          a.negative ^= 1;\n        }\n      }\n      if (q) {\n        q.words[j] = qj;\n      }\n    }\n    if (q) {\n      q.strip();\n    }\n    a.strip();\n\n    // Denormalize\n    if (mode !== 'div' && shift !== 0) {\n      a.iushrn(shift);\n    }\n\n    return {\n      div: q || null,\n      mod: a\n    };\n  };\n\n  // NOTE: 1) `mode` can be set to `mod` to request mod only,\n  //       to `div` to request div only, or be absent to\n  //       request both div & mod\n  //       2) `positive` is true if unsigned mod is requested\n  BN.prototype.divmod = function divmod (num, mode, positive) {\n    assert(!num.isZero());\n\n    if (this.isZero()) {\n      return {\n        div: new BN(0),\n        mod: new BN(0)\n      };\n    }\n\n    var div, mod, res;\n    if (this.negative !== 0 && num.negative === 0) {\n      res = this.neg().divmod(num, mode);\n\n      if (mode !== 'mod') {\n        div = res.div.neg();\n      }\n\n      if (mode !== 'div') {\n        mod = res.mod.neg();\n        if (positive && mod.negative !== 0) {\n          mod.iadd(num);\n        }\n      }\n\n      return {\n        div: div,\n        mod: mod\n      };\n    }\n\n    if (this.negative === 0 && num.negative !== 0) {\n      res = this.divmod(num.neg(), mode);\n\n      if (mode !== 'mod') {\n        div = res.div.neg();\n      }\n\n      return {\n        div: div,\n        mod: res.mod\n      };\n    }\n\n    if ((this.negative & num.negative) !== 0) {\n      res = this.neg().divmod(num.neg(), mode);\n\n      if (mode !== 'div') {\n        mod = res.mod.neg();\n        if (positive && mod.negative !== 0) {\n          mod.isub(num);\n        }\n      }\n\n      return {\n        div: res.div,\n        mod: mod\n      };\n    }\n\n    // Both numbers are positive at this point\n\n    // Strip both numbers to approximate shift value\n    if (num.length > this.length || this.cmp(num) < 0) {\n      return {\n        div: new BN(0),\n        mod: this\n      };\n    }\n\n    // Very short reduction\n    if (num.length === 1) {\n      if (mode === 'div') {\n        return {\n          div: this.divn(num.words[0]),\n          mod: null\n        };\n      }\n\n      if (mode === 'mod') {\n        return {\n          div: null,\n          mod: new BN(this.modn(num.words[0]))\n        };\n      }\n\n      return {\n        div: this.divn(num.words[0]),\n        mod: new BN(this.modn(num.words[0]))\n      };\n    }\n\n    return this._wordDiv(num, mode);\n  };\n\n  // Find `this` / `num`\n  BN.prototype.div = function div (num) {\n    return this.divmod(num, 'div', false).div;\n  };\n\n  // Find `this` % `num`\n  BN.prototype.mod = function mod (num) {\n    return this.divmod(num, 'mod', false).mod;\n  };\n\n  BN.prototype.umod = function umod (num) {\n    return this.divmod(num, 'mod', true).mod;\n  };\n\n  // Find Round(`this` / `num`)\n  BN.prototype.divRound = function divRound (num) {\n    var dm = this.divmod(num);\n\n    // Fast case - exact division\n    if (dm.mod.isZero()) return dm.div;\n\n    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;\n\n    var half = num.ushrn(1);\n    var r2 = num.andln(1);\n    var cmp = mod.cmp(half);\n\n    // Round down\n    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;\n\n    // Round up\n    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);\n  };\n\n  BN.prototype.modn = function modn (num) {\n    assert(num <= 0x3ffffff);\n    var p = (1 << 26) % num;\n\n    var acc = 0;\n    for (var i = this.length - 1; i >= 0; i--) {\n      acc = (p * acc + (this.words[i] | 0)) % num;\n    }\n\n    return acc;\n  };\n\n  // In-place division by number\n  BN.prototype.idivn = function idivn (num) {\n    assert(num <= 0x3ffffff);\n\n    var carry = 0;\n    for (var i = this.length - 1; i >= 0; i--) {\n      var w = (this.words[i] | 0) + carry * 0x4000000;\n      this.words[i] = (w / num) | 0;\n      carry = w % num;\n    }\n\n    return this.strip();\n  };\n\n  BN.prototype.divn = function divn (num) {\n    return this.clone().idivn(num);\n  };\n\n  BN.prototype.egcd = function egcd (p) {\n    assert(p.negative === 0);\n    assert(!p.isZero());\n\n    var x = this;\n    var y = p.clone();\n\n    if (x.negative !== 0) {\n      x = x.umod(p);\n    } else {\n      x = x.clone();\n    }\n\n    // A * x + B * y = x\n    var A = new BN(1);\n    var B = new BN(0);\n\n    // C * x + D * y = y\n    var C = new BN(0);\n    var D = new BN(1);\n\n    var g = 0;\n\n    while (x.isEven() && y.isEven()) {\n      x.iushrn(1);\n      y.iushrn(1);\n      ++g;\n    }\n\n    var yp = y.clone();\n    var xp = x.clone();\n\n    while (!x.isZero()) {\n      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);\n      if (i > 0) {\n        x.iushrn(i);\n        while (i-- > 0) {\n          if (A.isOdd() || B.isOdd()) {\n            A.iadd(yp);\n            B.isub(xp);\n          }\n\n          A.iushrn(1);\n          B.iushrn(1);\n        }\n      }\n\n      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);\n      if (j > 0) {\n        y.iushrn(j);\n        while (j-- > 0) {\n          if (C.isOdd() || D.isOdd()) {\n            C.iadd(yp);\n            D.isub(xp);\n          }\n\n          C.iushrn(1);\n          D.iushrn(1);\n        }\n      }\n\n      if (x.cmp(y) >= 0) {\n        x.isub(y);\n        A.isub(C);\n        B.isub(D);\n      } else {\n        y.isub(x);\n        C.isub(A);\n        D.isub(B);\n      }\n    }\n\n    return {\n      a: C,\n      b: D,\n      gcd: y.iushln(g)\n    };\n  };\n\n  // This is reduced incarnation of the binary EEA\n  // above, designated to invert members of the\n  // _prime_ fields F(p) at a maximal speed\n  BN.prototype._invmp = function _invmp (p) {\n    assert(p.negative === 0);\n    assert(!p.isZero());\n\n    var a = this;\n    var b = p.clone();\n\n    if (a.negative !== 0) {\n      a = a.umod(p);\n    } else {\n      a = a.clone();\n    }\n\n    var x1 = new BN(1);\n    var x2 = new BN(0);\n\n    var delta = b.clone();\n\n    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {\n      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);\n      if (i > 0) {\n        a.iushrn(i);\n        while (i-- > 0) {\n          if (x1.isOdd()) {\n            x1.iadd(delta);\n          }\n\n          x1.iushrn(1);\n        }\n      }\n\n      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);\n      if (j > 0) {\n        b.iushrn(j);\n        while (j-- > 0) {\n          if (x2.isOdd()) {\n            x2.iadd(delta);\n          }\n\n          x2.iushrn(1);\n        }\n      }\n\n      if (a.cmp(b) >= 0) {\n        a.isub(b);\n        x1.isub(x2);\n      } else {\n        b.isub(a);\n        x2.isub(x1);\n      }\n    }\n\n    var res;\n    if (a.cmpn(1) === 0) {\n      res = x1;\n    } else {\n      res = x2;\n    }\n\n    if (res.cmpn(0) < 0) {\n      res.iadd(p);\n    }\n\n    return res;\n  };\n\n  BN.prototype.gcd = function gcd (num) {\n    if (this.isZero()) return num.abs();\n    if (num.isZero()) return this.abs();\n\n    var a = this.clone();\n    var b = num.clone();\n    a.negative = 0;\n    b.negative = 0;\n\n    // Remove common factor of two\n    for (var shift = 0; a.isEven() && b.isEven(); shift++) {\n      a.iushrn(1);\n      b.iushrn(1);\n    }\n\n    do {\n      while (a.isEven()) {\n        a.iushrn(1);\n      }\n      while (b.isEven()) {\n        b.iushrn(1);\n      }\n\n      var r = a.cmp(b);\n      if (r < 0) {\n        // Swap `a` and `b` to make `a` always bigger than `b`\n        var t = a;\n        a = b;\n        b = t;\n      } else if (r === 0 || b.cmpn(1) === 0) {\n        break;\n      }\n\n      a.isub(b);\n    } while (true);\n\n    return b.iushln(shift);\n  };\n\n  // Invert number in the field F(num)\n  BN.prototype.invm = function invm (num) {\n    return this.egcd(num).a.umod(num);\n  };\n\n  BN.prototype.isEven = function isEven () {\n    return (this.words[0] & 1) === 0;\n  };\n\n  BN.prototype.isOdd = function isOdd () {\n    return (this.words[0] & 1) === 1;\n  };\n\n  // And first word and num\n  BN.prototype.andln = function andln (num) {\n    return this.words[0] & num;\n  };\n\n  // Increment at the bit position in-line\n  BN.prototype.bincn = function bincn (bit) {\n    assert(typeof bit === 'number');\n    var r = bit % 26;\n    var s = (bit - r) / 26;\n    var q = 1 << r;\n\n    // Fast case: bit is much higher than all existing words\n    if (this.length <= s) {\n      this._expand(s + 1);\n      this.words[s] |= q;\n      return this;\n    }\n\n    // Add bit and propagate, if needed\n    var carry = q;\n    for (var i = s; carry !== 0 && i < this.length; i++) {\n      var w = this.words[i] | 0;\n      w += carry;\n      carry = w >>> 26;\n      w &= 0x3ffffff;\n      this.words[i] = w;\n    }\n    if (carry !== 0) {\n      this.words[i] = carry;\n      this.length++;\n    }\n    return this;\n  };\n\n  BN.prototype.isZero = function isZero () {\n    return this.length === 1 && this.words[0] === 0;\n  };\n\n  BN.prototype.cmpn = function cmpn (num) {\n    var negative = num < 0;\n\n    if (this.negative !== 0 && !negative) return -1;\n    if (this.negative === 0 && negative) return 1;\n\n    this.strip();\n\n    var res;\n    if (this.length > 1) {\n      res = 1;\n    } else {\n      if (negative) {\n        num = -num;\n      }\n\n      assert(num <= 0x3ffffff, 'Number is too big');\n\n      var w = this.words[0] | 0;\n      res = w === num ? 0 : w < num ? -1 : 1;\n    }\n    if (this.negative !== 0) return -res | 0;\n    return res;\n  };\n\n  // Compare two numbers and return:\n  // 1 - if `this` > `num`\n  // 0 - if `this` == `num`\n  // -1 - if `this` < `num`\n  BN.prototype.cmp = function cmp (num) {\n    if (this.negative !== 0 && num.negative === 0) return -1;\n    if (this.negative === 0 && num.negative !== 0) return 1;\n\n    var res = this.ucmp(num);\n    if (this.negative !== 0) return -res | 0;\n    return res;\n  };\n\n  // Unsigned comparison\n  BN.prototype.ucmp = function ucmp (num) {\n    // At this point both numbers have the same sign\n    if (this.length > num.length) return 1;\n    if (this.length < num.length) return -1;\n\n    var res = 0;\n    for (var i = this.length - 1; i >= 0; i--) {\n      var a = this.words[i] | 0;\n      var b = num.words[i] | 0;\n\n      if (a === b) continue;\n      if (a < b) {\n        res = -1;\n      } else if (a > b) {\n        res = 1;\n      }\n      break;\n    }\n    return res;\n  };\n\n  BN.prototype.gtn = function gtn (num) {\n    return this.cmpn(num) === 1;\n  };\n\n  BN.prototype.gt = function gt (num) {\n    return this.cmp(num) === 1;\n  };\n\n  BN.prototype.gten = function gten (num) {\n    return this.cmpn(num) >= 0;\n  };\n\n  BN.prototype.gte = function gte (num) {\n    return this.cmp(num) >= 0;\n  };\n\n  BN.prototype.ltn = function ltn (num) {\n    return this.cmpn(num) === -1;\n  };\n\n  BN.prototype.lt = function lt (num) {\n    return this.cmp(num) === -1;\n  };\n\n  BN.prototype.lten = function lten (num) {\n    return this.cmpn(num) <= 0;\n  };\n\n  BN.prototype.lte = function lte (num) {\n    return this.cmp(num) <= 0;\n  };\n\n  BN.prototype.eqn = function eqn (num) {\n    return this.cmpn(num) === 0;\n  };\n\n  BN.prototype.eq = function eq (num) {\n    return this.cmp(num) === 0;\n  };\n\n  //\n  // A reduce context, could be using montgomery or something better, depending\n  // on the `m` itself.\n  //\n  BN.red = function red (num) {\n    return new Red(num);\n  };\n\n  BN.prototype.toRed = function toRed (ctx) {\n    assert(!this.red, 'Already a number in reduction context');\n    assert(this.negative === 0, 'red works only with positives');\n    return ctx.convertTo(this)._forceRed(ctx);\n  };\n\n  BN.prototype.fromRed = function fromRed () {\n    assert(this.red, 'fromRed works only with numbers in reduction context');\n    return this.red.convertFrom(this);\n  };\n\n  BN.prototype._forceRed = function _forceRed (ctx) {\n    this.red = ctx;\n    return this;\n  };\n\n  BN.prototype.forceRed = function forceRed (ctx) {\n    assert(!this.red, 'Already a number in reduction context');\n    return this._forceRed(ctx);\n  };\n\n  BN.prototype.redAdd = function redAdd (num) {\n    assert(this.red, 'redAdd works only with red numbers');\n    return this.red.add(this, num);\n  };\n\n  BN.prototype.redIAdd = function redIAdd (num) {\n    assert(this.red, 'redIAdd works only with red numbers');\n    return this.red.iadd(this, num);\n  };\n\n  BN.prototype.redSub = function redSub (num) {\n    assert(this.red, 'redSub works only with red numbers');\n    return this.red.sub(this, num);\n  };\n\n  BN.prototype.redISub = function redISub (num) {\n    assert(this.red, 'redISub works only with red numbers');\n    return this.red.isub(this, num);\n  };\n\n  BN.prototype.redShl = function redShl (num) {\n    assert(this.red, 'redShl works only with red numbers');\n    return this.red.shl(this, num);\n  };\n\n  BN.prototype.redMul = function redMul (num) {\n    assert(this.red, 'redMul works only with red numbers');\n    this.red._verify2(this, num);\n    return this.red.mul(this, num);\n  };\n\n  BN.prototype.redIMul = function redIMul (num) {\n    assert(this.red, 'redMul works only with red numbers');\n    this.red._verify2(this, num);\n    return this.red.imul(this, num);\n  };\n\n  BN.prototype.redSqr = function redSqr () {\n    assert(this.red, 'redSqr works only with red numbers');\n    this.red._verify1(this);\n    return this.red.sqr(this);\n  };\n\n  BN.prototype.redISqr = function redISqr () {\n    assert(this.red, 'redISqr works only with red numbers');\n    this.red._verify1(this);\n    return this.red.isqr(this);\n  };\n\n  // Square root over p\n  BN.prototype.redSqrt = function redSqrt () {\n    assert(this.red, 'redSqrt works only with red numbers');\n    this.red._verify1(this);\n    return this.red.sqrt(this);\n  };\n\n  BN.prototype.redInvm = function redInvm () {\n    assert(this.red, 'redInvm works only with red numbers');\n    this.red._verify1(this);\n    return this.red.invm(this);\n  };\n\n  // Return negative clone of `this` % `red modulo`\n  BN.prototype.redNeg = function redNeg () {\n    assert(this.red, 'redNeg works only with red numbers');\n    this.red._verify1(this);\n    return this.red.neg(this);\n  };\n\n  BN.prototype.redPow = function redPow (num) {\n    assert(this.red && !num.red, 'redPow(normalNum)');\n    this.red._verify1(this);\n    return this.red.pow(this, num);\n  };\n\n  // Prime numbers with efficient reduction\n  var primes = {\n    k256: null,\n    p224: null,\n    p192: null,\n    p25519: null\n  };\n\n  // Pseudo-Mersenne prime\n  function MPrime (name, p) {\n    // P = 2 ^ N - K\n    this.name = name;\n    this.p = new BN(p, 16);\n    this.n = this.p.bitLength();\n    this.k = new BN(1).iushln(this.n).isub(this.p);\n\n    this.tmp = this._tmp();\n  }\n\n  MPrime.prototype._tmp = function _tmp () {\n    var tmp = new BN(null);\n    tmp.words = new Array(Math.ceil(this.n / 13));\n    return tmp;\n  };\n\n  MPrime.prototype.ireduce = function ireduce (num) {\n    // Assumes that `num` is less than `P^2`\n    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)\n    var r = num;\n    var rlen;\n\n    do {\n      this.split(r, this.tmp);\n      r = this.imulK(r);\n      r = r.iadd(this.tmp);\n      rlen = r.bitLength();\n    } while (rlen > this.n);\n\n    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);\n    if (cmp === 0) {\n      r.words[0] = 0;\n      r.length = 1;\n    } else if (cmp > 0) {\n      r.isub(this.p);\n    } else {\n      if (r.strip !== undefined) {\n        // r is BN v4 instance\n        r.strip();\n      } else {\n        // r is BN v5 instance\n        r._strip();\n      }\n    }\n\n    return r;\n  };\n\n  MPrime.prototype.split = function split (input, out) {\n    input.iushrn(this.n, 0, out);\n  };\n\n  MPrime.prototype.imulK = function imulK (num) {\n    return num.imul(this.k);\n  };\n\n  function K256 () {\n    MPrime.call(\n      this,\n      'k256',\n      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');\n  }\n  inherits(K256, MPrime);\n\n  K256.prototype.split = function split (input, output) {\n    // 256 = 9 * 26 + 22\n    var mask = 0x3fffff;\n\n    var outLen = Math.min(input.length, 9);\n    for (var i = 0; i < outLen; i++) {\n      output.words[i] = input.words[i];\n    }\n    output.length = outLen;\n\n    if (input.length <= 9) {\n      input.words[0] = 0;\n      input.length = 1;\n      return;\n    }\n\n    // Shift by 9 limbs\n    var prev = input.words[9];\n    output.words[output.length++] = prev & mask;\n\n    for (i = 10; i < input.length; i++) {\n      var next = input.words[i] | 0;\n      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);\n      prev = next;\n    }\n    prev >>>= 22;\n    input.words[i - 10] = prev;\n    if (prev === 0 && input.length > 10) {\n      input.length -= 10;\n    } else {\n      input.length -= 9;\n    }\n  };\n\n  K256.prototype.imulK = function imulK (num) {\n    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]\n    num.words[num.length] = 0;\n    num.words[num.length + 1] = 0;\n    num.length += 2;\n\n    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390\n    var lo = 0;\n    for (var i = 0; i < num.length; i++) {\n      var w = num.words[i] | 0;\n      lo += w * 0x3d1;\n      num.words[i] = lo & 0x3ffffff;\n      lo = w * 0x40 + ((lo / 0x4000000) | 0);\n    }\n\n    // Fast length reduction\n    if (num.words[num.length - 1] === 0) {\n      num.length--;\n      if (num.words[num.length - 1] === 0) {\n        num.length--;\n      }\n    }\n    return num;\n  };\n\n  function P224 () {\n    MPrime.call(\n      this,\n      'p224',\n      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');\n  }\n  inherits(P224, MPrime);\n\n  function P192 () {\n    MPrime.call(\n      this,\n      'p192',\n      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');\n  }\n  inherits(P192, MPrime);\n\n  function P25519 () {\n    // 2 ^ 255 - 19\n    MPrime.call(\n      this,\n      '25519',\n      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');\n  }\n  inherits(P25519, MPrime);\n\n  P25519.prototype.imulK = function imulK (num) {\n    // K = 0x13\n    var carry = 0;\n    for (var i = 0; i < num.length; i++) {\n      var hi = (num.words[i] | 0) * 0x13 + carry;\n      var lo = hi & 0x3ffffff;\n      hi >>>= 26;\n\n      num.words[i] = lo;\n      carry = hi;\n    }\n    if (carry !== 0) {\n      num.words[num.length++] = carry;\n    }\n    return num;\n  };\n\n  // Exported mostly for testing purposes, use plain name instead\n  BN._prime = function prime (name) {\n    // Cached version of prime\n    if (primes[name]) return primes[name];\n\n    var prime;\n    if (name === 'k256') {\n      prime = new K256();\n    } else if (name === 'p224') {\n      prime = new P224();\n    } else if (name === 'p192') {\n      prime = new P192();\n    } else if (name === 'p25519') {\n      prime = new P25519();\n    } else {\n      throw new Error('Unknown prime ' + name);\n    }\n    primes[name] = prime;\n\n    return prime;\n  };\n\n  //\n  // Base reduction engine\n  //\n  function Red (m) {\n    if (typeof m === 'string') {\n      var prime = BN._prime(m);\n      this.m = prime.p;\n      this.prime = prime;\n    } else {\n      assert(m.gtn(1), 'modulus must be greater than 1');\n      this.m = m;\n      this.prime = null;\n    }\n  }\n\n  Red.prototype._verify1 = function _verify1 (a) {\n    assert(a.negative === 0, 'red works only with positives');\n    assert(a.red, 'red works only with red numbers');\n  };\n\n  Red.prototype._verify2 = function _verify2 (a, b) {\n    assert((a.negative | b.negative) === 0, 'red works only with positives');\n    assert(a.red && a.red === b.red,\n      'red works only with red numbers');\n  };\n\n  Red.prototype.imod = function imod (a) {\n    if (this.prime) return this.prime.ireduce(a)._forceRed(this);\n    return a.umod(this.m)._forceRed(this);\n  };\n\n  Red.prototype.neg = function neg (a) {\n    if (a.isZero()) {\n      return a.clone();\n    }\n\n    return this.m.sub(a)._forceRed(this);\n  };\n\n  Red.prototype.add = function add (a, b) {\n    this._verify2(a, b);\n\n    var res = a.add(b);\n    if (res.cmp(this.m) >= 0) {\n      res.isub(this.m);\n    }\n    return res._forceRed(this);\n  };\n\n  Red.prototype.iadd = function iadd (a, b) {\n    this._verify2(a, b);\n\n    var res = a.iadd(b);\n    if (res.cmp(this.m) >= 0) {\n      res.isub(this.m);\n    }\n    return res;\n  };\n\n  Red.prototype.sub = function sub (a, b) {\n    this._verify2(a, b);\n\n    var res = a.sub(b);\n    if (res.cmpn(0) < 0) {\n      res.iadd(this.m);\n    }\n    return res._forceRed(this);\n  };\n\n  Red.prototype.isub = function isub (a, b) {\n    this._verify2(a, b);\n\n    var res = a.isub(b);\n    if (res.cmpn(0) < 0) {\n      res.iadd(this.m);\n    }\n    return res;\n  };\n\n  Red.prototype.shl = function shl (a, num) {\n    this._verify1(a);\n    return this.imod(a.ushln(num));\n  };\n\n  Red.prototype.imul = function imul (a, b) {\n    this._verify2(a, b);\n    return this.imod(a.imul(b));\n  };\n\n  Red.prototype.mul = function mul (a, b) {\n    this._verify2(a, b);\n    return this.imod(a.mul(b));\n  };\n\n  Red.prototype.isqr = function isqr (a) {\n    return this.imul(a, a.clone());\n  };\n\n  Red.prototype.sqr = function sqr (a) {\n    return this.mul(a, a);\n  };\n\n  Red.prototype.sqrt = function sqrt (a) {\n    if (a.isZero()) return a.clone();\n\n    var mod3 = this.m.andln(3);\n    assert(mod3 % 2 === 1);\n\n    // Fast case\n    if (mod3 === 3) {\n      var pow = this.m.add(new BN(1)).iushrn(2);\n      return this.pow(a, pow);\n    }\n\n    // Tonelli-Shanks algorithm (Totally unoptimized and slow)\n    //\n    // Find Q and S, that Q * 2 ^ S = (P - 1)\n    var q = this.m.subn(1);\n    var s = 0;\n    while (!q.isZero() && q.andln(1) === 0) {\n      s++;\n      q.iushrn(1);\n    }\n    assert(!q.isZero());\n\n    var one = new BN(1).toRed(this);\n    var nOne = one.redNeg();\n\n    // Find quadratic non-residue\n    // NOTE: Max is such because of generalized Riemann hypothesis.\n    var lpow = this.m.subn(1).iushrn(1);\n    var z = this.m.bitLength();\n    z = new BN(2 * z * z).toRed(this);\n\n    while (this.pow(z, lpow).cmp(nOne) !== 0) {\n      z.redIAdd(nOne);\n    }\n\n    var c = this.pow(z, q);\n    var r = this.pow(a, q.addn(1).iushrn(1));\n    var t = this.pow(a, q);\n    var m = s;\n    while (t.cmp(one) !== 0) {\n      var tmp = t;\n      for (var i = 0; tmp.cmp(one) !== 0; i++) {\n        tmp = tmp.redSqr();\n      }\n      assert(i < m);\n      var b = this.pow(c, new BN(1).iushln(m - i - 1));\n\n      r = r.redMul(b);\n      c = b.redSqr();\n      t = t.redMul(c);\n      m = i;\n    }\n\n    return r;\n  };\n\n  Red.prototype.invm = function invm (a) {\n    var inv = a._invmp(this.m);\n    if (inv.negative !== 0) {\n      inv.negative = 0;\n      return this.imod(inv).redNeg();\n    } else {\n      return this.imod(inv);\n    }\n  };\n\n  Red.prototype.pow = function pow (a, num) {\n    if (num.isZero()) return new BN(1).toRed(this);\n    if (num.cmpn(1) === 0) return a.clone();\n\n    var windowSize = 4;\n    var wnd = new Array(1 << windowSize);\n    wnd[0] = new BN(1).toRed(this);\n    wnd[1] = a;\n    for (var i = 2; i < wnd.length; i++) {\n      wnd[i] = this.mul(wnd[i - 1], a);\n    }\n\n    var res = wnd[0];\n    var current = 0;\n    var currentLen = 0;\n    var start = num.bitLength() % 26;\n    if (start === 0) {\n      start = 26;\n    }\n\n    for (i = num.length - 1; i >= 0; i--) {\n      var word = num.words[i];\n      for (var j = start - 1; j >= 0; j--) {\n        var bit = (word >> j) & 1;\n        if (res !== wnd[0]) {\n          res = this.sqr(res);\n        }\n\n        if (bit === 0 && current === 0) {\n          currentLen = 0;\n          continue;\n        }\n\n        current <<= 1;\n        current |= bit;\n        currentLen++;\n        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;\n\n        res = this.mul(res, wnd[current]);\n        currentLen = 0;\n        current = 0;\n      }\n      start = 26;\n    }\n\n    return res;\n  };\n\n  Red.prototype.convertTo = function convertTo (num) {\n    var r = num.umod(this.m);\n\n    return r === num ? r.clone() : r;\n  };\n\n  Red.prototype.convertFrom = function convertFrom (num) {\n    var res = num.clone();\n    res.red = null;\n    return res;\n  };\n\n  //\n  // Montgomery method engine\n  //\n\n  BN.mont = function mont (num) {\n    return new Mont(num);\n  };\n\n  function Mont (m) {\n    Red.call(this, m);\n\n    this.shift = this.m.bitLength();\n    if (this.shift % 26 !== 0) {\n      this.shift += 26 - (this.shift % 26);\n    }\n\n    this.r = new BN(1).iushln(this.shift);\n    this.r2 = this.imod(this.r.sqr());\n    this.rinv = this.r._invmp(this.m);\n\n    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);\n    this.minv = this.minv.umod(this.r);\n    this.minv = this.r.sub(this.minv);\n  }\n  inherits(Mont, Red);\n\n  Mont.prototype.convertTo = function convertTo (num) {\n    return this.imod(num.ushln(this.shift));\n  };\n\n  Mont.prototype.convertFrom = function convertFrom (num) {\n    var r = this.imod(num.mul(this.rinv));\n    r.red = null;\n    return r;\n  };\n\n  Mont.prototype.imul = function imul (a, b) {\n    if (a.isZero() || b.isZero()) {\n      a.words[0] = 0;\n      a.length = 1;\n      return a;\n    }\n\n    var t = a.imul(b);\n    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);\n    var u = t.isub(c).iushrn(this.shift);\n    var res = u;\n\n    if (u.cmp(this.m) >= 0) {\n      res = u.isub(this.m);\n    } else if (u.cmpn(0) < 0) {\n      res = u.iadd(this.m);\n    }\n\n    return res._forceRed(this);\n  };\n\n  Mont.prototype.mul = function mul (a, b) {\n    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);\n\n    var t = a.mul(b);\n    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);\n    var u = t.isub(c).iushrn(this.shift);\n    var res = u;\n    if (u.cmp(this.m) >= 0) {\n      res = u.isub(this.m);\n    } else if (u.cmpn(0) < 0) {\n      res = u.iadd(this.m);\n    }\n\n    return res._forceRed(this);\n  };\n\n  Mont.prototype.invm = function invm (a) {\n    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R\n    var res = this.imod(a._invmp(this.m).mul(this.r2));\n    return res._forceRed(this);\n  };\n})( false || module, this);\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack:///./node_modules/bn.js/lib/bn.js?");

/***/ }),

/***/ "./node_modules/camelcase/index.js":
/*!*****************************************!*\
  !*** ./node_modules/camelcase/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst preserveCamelCase = string => {\n\tlet isLastCharLower = false;\n\tlet isLastCharUpper = false;\n\tlet isLastLastCharUpper = false;\n\n\tfor (let i = 0; i < string.length; i++) {\n\t\tconst character = string[i];\n\n\t\tif (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {\n\t\t\tstring = string.slice(0, i) + '-' + string.slice(i);\n\t\t\tisLastCharLower = false;\n\t\t\tisLastLastCharUpper = isLastCharUpper;\n\t\t\tisLastCharUpper = true;\n\t\t\ti++;\n\t\t} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character) {\n\t\t\tstring = string.slice(0, i - 1) + '-' + string.slice(i - 1);\n\t\t\tisLastLastCharUpper = isLastCharUpper;\n\t\t\tisLastCharUpper = false;\n\t\t\tisLastCharLower = true;\n\t\t} else {\n\t\t\tisLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;\n\t\t\tisLastLastCharUpper = isLastCharUpper;\n\t\t\tisLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;\n\t\t}\n\t}\n\n\treturn string;\n};\n\nconst camelCase = (input, options) => {\n\tif (!(typeof input === 'string' || Array.isArray(input))) {\n\t\tthrow new TypeError('Expected the input to be `string | string[]`');\n\t}\n\n\toptions = Object.assign({\n\t\tpascalCase: false\n\t}, options);\n\n\tconst postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;\n\n\tif (Array.isArray(input)) {\n\t\tinput = input.map(x => x.trim())\n\t\t\t.filter(x => x.length)\n\t\t\t.join('-');\n\t} else {\n\t\tinput = input.trim();\n\t}\n\n\tif (input.length === 0) {\n\t\treturn '';\n\t}\n\n\tif (input.length === 1) {\n\t\treturn options.pascalCase ? input.toUpperCase() : input.toLowerCase();\n\t}\n\n\tconst hasUpperCase = input !== input.toLowerCase();\n\n\tif (hasUpperCase) {\n\t\tinput = preserveCamelCase(input);\n\t}\n\n\tinput = input\n\t\t.replace(/^[_.\\- ]+/, '')\n\t\t.toLowerCase()\n\t\t.replace(/[_.\\- ]+(\\w|$)/g, (_, p1) => p1.toUpperCase())\n\t\t.replace(/\\d+(\\w|$)/g, m => m.toUpperCase());\n\n\treturn postProcess(input);\n};\n\nmodule.exports = camelCase;\n// TODO: Remove this for the next major release\nmodule.exports.default = camelCase;\n\n\n//# sourceURL=webpack:///./node_modules/camelcase/index.js?");

/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar has = Object.prototype.hasOwnProperty\n  , prefix = '~';\n\n/**\n * Constructor to create a storage for our `EE` objects.\n * An `Events` instance is a plain object whose properties are event names.\n *\n * @constructor\n * @private\n */\nfunction Events() {}\n\n//\n// We try to not inherit from `Object.prototype`. In some engines creating an\n// instance in this way is faster than calling `Object.create(null)` directly.\n// If `Object.create(null)` is not supported we prefix the event names with a\n// character to make sure that the built-in object properties are not\n// overridden or used as an attack vector.\n//\nif (Object.create) {\n  Events.prototype = Object.create(null);\n\n  //\n  // This hack is needed because the `__proto__` property is still inherited in\n  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.\n  //\n  if (!new Events().__proto__) prefix = false;\n}\n\n/**\n * Representation of a single event listener.\n *\n * @param {Function} fn The listener function.\n * @param {*} context The context to invoke the listener with.\n * @param {Boolean} [once=false] Specify if the listener is a one-time listener.\n * @constructor\n * @private\n */\nfunction EE(fn, context, once) {\n  this.fn = fn;\n  this.context = context;\n  this.once = once || false;\n}\n\n/**\n * Add a listener for a given event.\n *\n * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.\n * @param {(String|Symbol)} event The event name.\n * @param {Function} fn The listener function.\n * @param {*} context The context to invoke the listener with.\n * @param {Boolean} once Specify if the listener is a one-time listener.\n * @returns {EventEmitter}\n * @private\n */\nfunction addListener(emitter, event, fn, context, once) {\n  if (typeof fn !== 'function') {\n    throw new TypeError('The listener must be a function');\n  }\n\n  var listener = new EE(fn, context || emitter, once)\n    , evt = prefix ? prefix + event : event;\n\n  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;\n  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);\n  else emitter._events[evt] = [emitter._events[evt], listener];\n\n  return emitter;\n}\n\n/**\n * Clear event by name.\n *\n * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.\n * @param {(String|Symbol)} evt The Event name.\n * @private\n */\nfunction clearEvent(emitter, evt) {\n  if (--emitter._eventsCount === 0) emitter._events = new Events();\n  else delete emitter._events[evt];\n}\n\n/**\n * Minimal `EventEmitter` interface that is molded against the Node.js\n * `EventEmitter` interface.\n *\n * @constructor\n * @public\n */\nfunction EventEmitter() {\n  this._events = new Events();\n  this._eventsCount = 0;\n}\n\n/**\n * Return an array listing the events for which the emitter has registered\n * listeners.\n *\n * @returns {Array}\n * @public\n */\nEventEmitter.prototype.eventNames = function eventNames() {\n  var names = []\n    , events\n    , name;\n\n  if (this._eventsCount === 0) return names;\n\n  for (name in (events = this._events)) {\n    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);\n  }\n\n  if (Object.getOwnPropertySymbols) {\n    return names.concat(Object.getOwnPropertySymbols(events));\n  }\n\n  return names;\n};\n\n/**\n * Return the listeners registered for a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @returns {Array} The registered listeners.\n * @public\n */\nEventEmitter.prototype.listeners = function listeners(event) {\n  var evt = prefix ? prefix + event : event\n    , handlers = this._events[evt];\n\n  if (!handlers) return [];\n  if (handlers.fn) return [handlers.fn];\n\n  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {\n    ee[i] = handlers[i].fn;\n  }\n\n  return ee;\n};\n\n/**\n * Return the number of listeners listening to a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @returns {Number} The number of listeners.\n * @public\n */\nEventEmitter.prototype.listenerCount = function listenerCount(event) {\n  var evt = prefix ? prefix + event : event\n    , listeners = this._events[evt];\n\n  if (!listeners) return 0;\n  if (listeners.fn) return 1;\n  return listeners.length;\n};\n\n/**\n * Calls each of the listeners registered for a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @returns {Boolean} `true` if the event had listeners, else `false`.\n * @public\n */\nEventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {\n  var evt = prefix ? prefix + event : event;\n\n  if (!this._events[evt]) return false;\n\n  var listeners = this._events[evt]\n    , len = arguments.length\n    , args\n    , i;\n\n  if (listeners.fn) {\n    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);\n\n    switch (len) {\n      case 1: return listeners.fn.call(listeners.context), true;\n      case 2: return listeners.fn.call(listeners.context, a1), true;\n      case 3: return listeners.fn.call(listeners.context, a1, a2), true;\n      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;\n      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;\n      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;\n    }\n\n    for (i = 1, args = new Array(len -1); i < len; i++) {\n      args[i - 1] = arguments[i];\n    }\n\n    listeners.fn.apply(listeners.context, args);\n  } else {\n    var length = listeners.length\n      , j;\n\n    for (i = 0; i < length; i++) {\n      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);\n\n      switch (len) {\n        case 1: listeners[i].fn.call(listeners[i].context); break;\n        case 2: listeners[i].fn.call(listeners[i].context, a1); break;\n        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;\n        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;\n        default:\n          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {\n            args[j - 1] = arguments[j];\n          }\n\n          listeners[i].fn.apply(listeners[i].context, args);\n      }\n    }\n  }\n\n  return true;\n};\n\n/**\n * Add a listener for a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @param {Function} fn The listener function.\n * @param {*} [context=this] The context to invoke the listener with.\n * @returns {EventEmitter} `this`.\n * @public\n */\nEventEmitter.prototype.on = function on(event, fn, context) {\n  return addListener(this, event, fn, context, false);\n};\n\n/**\n * Add a one-time listener for a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @param {Function} fn The listener function.\n * @param {*} [context=this] The context to invoke the listener with.\n * @returns {EventEmitter} `this`.\n * @public\n */\nEventEmitter.prototype.once = function once(event, fn, context) {\n  return addListener(this, event, fn, context, true);\n};\n\n/**\n * Remove the listeners of a given event.\n *\n * @param {(String|Symbol)} event The event name.\n * @param {Function} fn Only remove the listeners that match this function.\n * @param {*} context Only remove the listeners that have this context.\n * @param {Boolean} once Only remove one-time listeners.\n * @returns {EventEmitter} `this`.\n * @public\n */\nEventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {\n  var evt = prefix ? prefix + event : event;\n\n  if (!this._events[evt]) return this;\n  if (!fn) {\n    clearEvent(this, evt);\n    return this;\n  }\n\n  var listeners = this._events[evt];\n\n  if (listeners.fn) {\n    if (\n      listeners.fn === fn &&\n      (!once || listeners.once) &&\n      (!context || listeners.context === context)\n    ) {\n      clearEvent(this, evt);\n    }\n  } else {\n    for (var i = 0, events = [], length = listeners.length; i < length; i++) {\n      if (\n        listeners[i].fn !== fn ||\n        (once && !listeners[i].once) ||\n        (context && listeners[i].context !== context)\n      ) {\n        events.push(listeners[i]);\n      }\n    }\n\n    //\n    // Reset the array, or remove it completely if we have no more listeners.\n    //\n    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;\n    else clearEvent(this, evt);\n  }\n\n  return this;\n};\n\n/**\n * Remove all listeners, or those of the specified event.\n *\n * @param {(String|Symbol)} [event] The event name.\n * @returns {EventEmitter} `this`.\n * @public\n */\nEventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {\n  var evt;\n\n  if (event) {\n    evt = prefix ? prefix + event : event;\n    if (this._events[evt]) clearEvent(this, evt);\n  } else {\n    this._events = new Events();\n    this._eventsCount = 0;\n  }\n\n  return this;\n};\n\n//\n// Alias methods names because people roll like that.\n//\nEventEmitter.prototype.off = EventEmitter.prototype.removeListener;\nEventEmitter.prototype.addListener = EventEmitter.prototype.on;\n\n//\n// Expose the prefix.\n//\nEventEmitter.prefixed = prefix;\n\n//\n// Allow `EventEmitter` to be imported as module namespace.\n//\nEventEmitter.EventEmitter = EventEmitter;\n\n//\n// Expose the module.\n//\nif (true) {\n  module.exports = EventEmitter;\n}\n\n\n//# sourceURL=webpack:///./node_modules/eventemitter3/index.js?");

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */\nexports.read = function (buffer, offset, isLE, mLen, nBytes) {\n  var e, m\n  var eLen = (nBytes * 8) - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var nBits = -7\n  var i = isLE ? (nBytes - 1) : 0\n  var d = isLE ? -1 : 1\n  var s = buffer[offset + i]\n\n  i += d\n\n  e = s & ((1 << (-nBits)) - 1)\n  s >>= (-nBits)\n  nBits += eLen\n  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}\n\n  m = e & ((1 << (-nBits)) - 1)\n  e >>= (-nBits)\n  nBits += mLen\n  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}\n\n  if (e === 0) {\n    e = 1 - eBias\n  } else if (e === eMax) {\n    return m ? NaN : ((s ? -1 : 1) * Infinity)\n  } else {\n    m = m + Math.pow(2, mLen)\n    e = e - eBias\n  }\n  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)\n}\n\nexports.write = function (buffer, value, offset, isLE, mLen, nBytes) {\n  var e, m, c\n  var eLen = (nBytes * 8) - mLen - 1\n  var eMax = (1 << eLen) - 1\n  var eBias = eMax >> 1\n  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)\n  var i = isLE ? 0 : (nBytes - 1)\n  var d = isLE ? 1 : -1\n  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0\n\n  value = Math.abs(value)\n\n  if (isNaN(value) || value === Infinity) {\n    m = isNaN(value) ? 1 : 0\n    e = eMax\n  } else {\n    e = Math.floor(Math.log(value) / Math.LN2)\n    if (value * (c = Math.pow(2, -e)) < 1) {\n      e--\n      c *= 2\n    }\n    if (e + eBias >= 1) {\n      value += rt / c\n    } else {\n      value += rt * Math.pow(2, 1 - eBias)\n    }\n    if (value * c >= 2) {\n      e++\n      c /= 2\n    }\n\n    if (e + eBias >= eMax) {\n      m = 0\n      e = eMax\n    } else if (e + eBias >= 1) {\n      m = ((value * c) - 1) * Math.pow(2, mLen)\n      e = e + eBias\n    } else {\n      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)\n      e = 0\n    }\n  }\n\n  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}\n\n  e = (e << mLen) | m\n  eLen += mLen\n  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}\n\n  buffer[offset + i - d] |= s * 128\n}\n\n\n//# sourceURL=webpack:///./node_modules/ieee754/index.js?");

/***/ }),

/***/ "./node_modules/ip-regex/index.js":
/*!****************************************!*\
  !*** ./node_modules/ip-regex/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst word = '[a-fA-F\\\\d:]';\nconst b = options => options && options.includeBoundaries ?\n\t`(?:(?<=\\\\s|^)(?=${word})|(?<=${word})(?=\\\\s|$))` :\n\t'';\n\nconst v4 = '(?:25[0-5]|2[0-4]\\\\d|1\\\\d\\\\d|[1-9]\\\\d|\\\\d)(?:\\\\.(?:25[0-5]|2[0-4]\\\\d|1\\\\d\\\\d|[1-9]\\\\d|\\\\d)){3}';\n\nconst v6seg = '[a-fA-F\\\\d]{1,4}';\nconst v6 = `\n(?:\n(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n`.replace(/\\s*\\/\\/.*$/gm, '').replace(/\\n/g, '').trim();\n\n// Pre-compile only the exact regexes because adding a global flag make regexes stateful\nconst v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);\nconst v4exact = new RegExp(`^${v4}$`);\nconst v6exact = new RegExp(`^${v6}$`);\n\nconst ip = options => options && options.exact ?\n\tv46Exact :\n\tnew RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');\n\nip.v4 = options => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, 'g');\nip.v6 = options => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');\n\nmodule.exports = ip;\n\n\n//# sourceURL=webpack:///./node_modules/ip-regex/index.js?");

/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var toString = {}.toString;\n\nmodule.exports = Array.isArray || function (arr) {\n  return toString.call(arr) == '[object Array]';\n};\n\n\n//# sourceURL=webpack:///./node_modules/isarray/index.js?");

/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/buffer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/buffer/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(global) {/*!\n * The buffer module from node.js, for the browser.\n *\n * @author   Feross Aboukhadijeh <http://feross.org>\n * @license  MIT\n */\n/* eslint-disable no-proto */\n\n\n\nvar base64 = __webpack_require__(/*! base64-js */ \"./node_modules/base64-js/index.js\")\nvar ieee754 = __webpack_require__(/*! ieee754 */ \"./node_modules/ieee754/index.js\")\nvar isArray = __webpack_require__(/*! isarray */ \"./node_modules/isarray/index.js\")\n\nexports.Buffer = Buffer\nexports.SlowBuffer = SlowBuffer\nexports.INSPECT_MAX_BYTES = 50\n\n/**\n * If `Buffer.TYPED_ARRAY_SUPPORT`:\n *   === true    Use Uint8Array implementation (fastest)\n *   === false   Use Object implementation (most compatible, even IE6)\n *\n * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,\n * Opera 11.6+, iOS 4.2+.\n *\n * Due to various browser bugs, sometimes the Object implementation will be used even\n * when the browser supports typed arrays.\n *\n * Note:\n *\n *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,\n *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.\n *\n *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.\n *\n *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of\n *     incorrect length in some situations.\n\n * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they\n * get the Object implementation, which is slower but behaves correctly.\n */\nBuffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined\n  ? global.TYPED_ARRAY_SUPPORT\n  : typedArraySupport()\n\n/*\n * Export kMaxLength after typed array support is determined.\n */\nexports.kMaxLength = kMaxLength()\n\nfunction typedArraySupport () {\n  try {\n    var arr = new Uint8Array(1)\n    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}\n    return arr.foo() === 42 && // typed array instances can be augmented\n        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`\n        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`\n  } catch (e) {\n    return false\n  }\n}\n\nfunction kMaxLength () {\n  return Buffer.TYPED_ARRAY_SUPPORT\n    ? 0x7fffffff\n    : 0x3fffffff\n}\n\nfunction createBuffer (that, length) {\n  if (kMaxLength() < length) {\n    throw new RangeError('Invalid typed array length')\n  }\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    that = new Uint8Array(length)\n    that.__proto__ = Buffer.prototype\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    if (that === null) {\n      that = new Buffer(length)\n    }\n    that.length = length\n  }\n\n  return that\n}\n\n/**\n * The Buffer constructor returns instances of `Uint8Array` that have their\n * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of\n * `Uint8Array`, so the returned instances will have all the node `Buffer` methods\n * and the `Uint8Array` methods. Square bracket notation works as expected -- it\n * returns a single octet.\n *\n * The `Uint8Array` prototype remains unmodified.\n */\n\nfunction Buffer (arg, encodingOrOffset, length) {\n  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {\n    return new Buffer(arg, encodingOrOffset, length)\n  }\n\n  // Common case.\n  if (typeof arg === 'number') {\n    if (typeof encodingOrOffset === 'string') {\n      throw new Error(\n        'If encoding is specified then the first argument must be a string'\n      )\n    }\n    return allocUnsafe(this, arg)\n  }\n  return from(this, arg, encodingOrOffset, length)\n}\n\nBuffer.poolSize = 8192 // not used by this implementation\n\n// TODO: Legacy, not needed anymore. Remove in next major version.\nBuffer._augment = function (arr) {\n  arr.__proto__ = Buffer.prototype\n  return arr\n}\n\nfunction from (that, value, encodingOrOffset, length) {\n  if (typeof value === 'number') {\n    throw new TypeError('\"value\" argument must not be a number')\n  }\n\n  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {\n    return fromArrayBuffer(that, value, encodingOrOffset, length)\n  }\n\n  if (typeof value === 'string') {\n    return fromString(that, value, encodingOrOffset)\n  }\n\n  return fromObject(that, value)\n}\n\n/**\n * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError\n * if value is a number.\n * Buffer.from(str[, encoding])\n * Buffer.from(array)\n * Buffer.from(buffer)\n * Buffer.from(arrayBuffer[, byteOffset[, length]])\n **/\nBuffer.from = function (value, encodingOrOffset, length) {\n  return from(null, value, encodingOrOffset, length)\n}\n\nif (Buffer.TYPED_ARRAY_SUPPORT) {\n  Buffer.prototype.__proto__ = Uint8Array.prototype\n  Buffer.__proto__ = Uint8Array\n  if (typeof Symbol !== 'undefined' && Symbol.species &&\n      Buffer[Symbol.species] === Buffer) {\n    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97\n    Object.defineProperty(Buffer, Symbol.species, {\n      value: null,\n      configurable: true\n    })\n  }\n}\n\nfunction assertSize (size) {\n  if (typeof size !== 'number') {\n    throw new TypeError('\"size\" argument must be a number')\n  } else if (size < 0) {\n    throw new RangeError('\"size\" argument must not be negative')\n  }\n}\n\nfunction alloc (that, size, fill, encoding) {\n  assertSize(size)\n  if (size <= 0) {\n    return createBuffer(that, size)\n  }\n  if (fill !== undefined) {\n    // Only pay attention to encoding if it's a string. This\n    // prevents accidentally sending in a number that would\n    // be interpretted as a start offset.\n    return typeof encoding === 'string'\n      ? createBuffer(that, size).fill(fill, encoding)\n      : createBuffer(that, size).fill(fill)\n  }\n  return createBuffer(that, size)\n}\n\n/**\n * Creates a new filled Buffer instance.\n * alloc(size[, fill[, encoding]])\n **/\nBuffer.alloc = function (size, fill, encoding) {\n  return alloc(null, size, fill, encoding)\n}\n\nfunction allocUnsafe (that, size) {\n  assertSize(size)\n  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) {\n    for (var i = 0; i < size; ++i) {\n      that[i] = 0\n    }\n  }\n  return that\n}\n\n/**\n * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.\n * */\nBuffer.allocUnsafe = function (size) {\n  return allocUnsafe(null, size)\n}\n/**\n * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.\n */\nBuffer.allocUnsafeSlow = function (size) {\n  return allocUnsafe(null, size)\n}\n\nfunction fromString (that, string, encoding) {\n  if (typeof encoding !== 'string' || encoding === '') {\n    encoding = 'utf8'\n  }\n\n  if (!Buffer.isEncoding(encoding)) {\n    throw new TypeError('\"encoding\" must be a valid string encoding')\n  }\n\n  var length = byteLength(string, encoding) | 0\n  that = createBuffer(that, length)\n\n  var actual = that.write(string, encoding)\n\n  if (actual !== length) {\n    // Writing a hex string, for example, that contains invalid characters will\n    // cause everything after the first invalid character to be ignored. (e.g.\n    // 'abxxcd' will be treated as 'ab')\n    that = that.slice(0, actual)\n  }\n\n  return that\n}\n\nfunction fromArrayLike (that, array) {\n  var length = array.length < 0 ? 0 : checked(array.length) | 0\n  that = createBuffer(that, length)\n  for (var i = 0; i < length; i += 1) {\n    that[i] = array[i] & 255\n  }\n  return that\n}\n\nfunction fromArrayBuffer (that, array, byteOffset, length) {\n  array.byteLength // this throws if `array` is not a valid ArrayBuffer\n\n  if (byteOffset < 0 || array.byteLength < byteOffset) {\n    throw new RangeError('\\'offset\\' is out of bounds')\n  }\n\n  if (array.byteLength < byteOffset + (length || 0)) {\n    throw new RangeError('\\'length\\' is out of bounds')\n  }\n\n  if (byteOffset === undefined && length === undefined) {\n    array = new Uint8Array(array)\n  } else if (length === undefined) {\n    array = new Uint8Array(array, byteOffset)\n  } else {\n    array = new Uint8Array(array, byteOffset, length)\n  }\n\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    // Return an augmented `Uint8Array` instance, for best performance\n    that = array\n    that.__proto__ = Buffer.prototype\n  } else {\n    // Fallback: Return an object instance of the Buffer class\n    that = fromArrayLike(that, array)\n  }\n  return that\n}\n\nfunction fromObject (that, obj) {\n  if (Buffer.isBuffer(obj)) {\n    var len = checked(obj.length) | 0\n    that = createBuffer(that, len)\n\n    if (that.length === 0) {\n      return that\n    }\n\n    obj.copy(that, 0, 0, len)\n    return that\n  }\n\n  if (obj) {\n    if ((typeof ArrayBuffer !== 'undefined' &&\n        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {\n      if (typeof obj.length !== 'number' || isnan(obj.length)) {\n        return createBuffer(that, 0)\n      }\n      return fromArrayLike(that, obj)\n    }\n\n    if (obj.type === 'Buffer' && isArray(obj.data)) {\n      return fromArrayLike(that, obj.data)\n    }\n  }\n\n  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')\n}\n\nfunction checked (length) {\n  // Note: cannot use `length < kMaxLength()` here because that fails when\n  // length is NaN (which is otherwise coerced to zero.)\n  if (length >= kMaxLength()) {\n    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +\n                         'size: 0x' + kMaxLength().toString(16) + ' bytes')\n  }\n  return length | 0\n}\n\nfunction SlowBuffer (length) {\n  if (+length != length) { // eslint-disable-line eqeqeq\n    length = 0\n  }\n  return Buffer.alloc(+length)\n}\n\nBuffer.isBuffer = function isBuffer (b) {\n  return !!(b != null && b._isBuffer)\n}\n\nBuffer.compare = function compare (a, b) {\n  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {\n    throw new TypeError('Arguments must be Buffers')\n  }\n\n  if (a === b) return 0\n\n  var x = a.length\n  var y = b.length\n\n  for (var i = 0, len = Math.min(x, y); i < len; ++i) {\n    if (a[i] !== b[i]) {\n      x = a[i]\n      y = b[i]\n      break\n    }\n  }\n\n  if (x < y) return -1\n  if (y < x) return 1\n  return 0\n}\n\nBuffer.isEncoding = function isEncoding (encoding) {\n  switch (String(encoding).toLowerCase()) {\n    case 'hex':\n    case 'utf8':\n    case 'utf-8':\n    case 'ascii':\n    case 'latin1':\n    case 'binary':\n    case 'base64':\n    case 'ucs2':\n    case 'ucs-2':\n    case 'utf16le':\n    case 'utf-16le':\n      return true\n    default:\n      return false\n  }\n}\n\nBuffer.concat = function concat (list, length) {\n  if (!isArray(list)) {\n    throw new TypeError('\"list\" argument must be an Array of Buffers')\n  }\n\n  if (list.length === 0) {\n    return Buffer.alloc(0)\n  }\n\n  var i\n  if (length === undefined) {\n    length = 0\n    for (i = 0; i < list.length; ++i) {\n      length += list[i].length\n    }\n  }\n\n  var buffer = Buffer.allocUnsafe(length)\n  var pos = 0\n  for (i = 0; i < list.length; ++i) {\n    var buf = list[i]\n    if (!Buffer.isBuffer(buf)) {\n      throw new TypeError('\"list\" argument must be an Array of Buffers')\n    }\n    buf.copy(buffer, pos)\n    pos += buf.length\n  }\n  return buffer\n}\n\nfunction byteLength (string, encoding) {\n  if (Buffer.isBuffer(string)) {\n    return string.length\n  }\n  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&\n      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {\n    return string.byteLength\n  }\n  if (typeof string !== 'string') {\n    string = '' + string\n  }\n\n  var len = string.length\n  if (len === 0) return 0\n\n  // Use a for loop to avoid recursion\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'ascii':\n      case 'latin1':\n      case 'binary':\n        return len\n      case 'utf8':\n      case 'utf-8':\n      case undefined:\n        return utf8ToBytes(string).length\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return len * 2\n      case 'hex':\n        return len >>> 1\n      case 'base64':\n        return base64ToBytes(string).length\n      default:\n        if (loweredCase) return utf8ToBytes(string).length // assume utf8\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\nBuffer.byteLength = byteLength\n\nfunction slowToString (encoding, start, end) {\n  var loweredCase = false\n\n  // No need to verify that \"this.length <= MAX_UINT32\" since it's a read-only\n  // property of a typed array.\n\n  // This behaves neither like String nor Uint8Array in that we set start/end\n  // to their upper/lower bounds if the value passed is out of range.\n  // undefined is handled specially as per ECMA-262 6th Edition,\n  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.\n  if (start === undefined || start < 0) {\n    start = 0\n  }\n  // Return early if start > this.length. Done here to prevent potential uint32\n  // coercion fail below.\n  if (start > this.length) {\n    return ''\n  }\n\n  if (end === undefined || end > this.length) {\n    end = this.length\n  }\n\n  if (end <= 0) {\n    return ''\n  }\n\n  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.\n  end >>>= 0\n  start >>>= 0\n\n  if (end <= start) {\n    return ''\n  }\n\n  if (!encoding) encoding = 'utf8'\n\n  while (true) {\n    switch (encoding) {\n      case 'hex':\n        return hexSlice(this, start, end)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Slice(this, start, end)\n\n      case 'ascii':\n        return asciiSlice(this, start, end)\n\n      case 'latin1':\n      case 'binary':\n        return latin1Slice(this, start, end)\n\n      case 'base64':\n        return base64Slice(this, start, end)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return utf16leSlice(this, start, end)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = (encoding + '').toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\n// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect\n// Buffer instances.\nBuffer.prototype._isBuffer = true\n\nfunction swap (b, n, m) {\n  var i = b[n]\n  b[n] = b[m]\n  b[m] = i\n}\n\nBuffer.prototype.swap16 = function swap16 () {\n  var len = this.length\n  if (len % 2 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 16-bits')\n  }\n  for (var i = 0; i < len; i += 2) {\n    swap(this, i, i + 1)\n  }\n  return this\n}\n\nBuffer.prototype.swap32 = function swap32 () {\n  var len = this.length\n  if (len % 4 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 32-bits')\n  }\n  for (var i = 0; i < len; i += 4) {\n    swap(this, i, i + 3)\n    swap(this, i + 1, i + 2)\n  }\n  return this\n}\n\nBuffer.prototype.swap64 = function swap64 () {\n  var len = this.length\n  if (len % 8 !== 0) {\n    throw new RangeError('Buffer size must be a multiple of 64-bits')\n  }\n  for (var i = 0; i < len; i += 8) {\n    swap(this, i, i + 7)\n    swap(this, i + 1, i + 6)\n    swap(this, i + 2, i + 5)\n    swap(this, i + 3, i + 4)\n  }\n  return this\n}\n\nBuffer.prototype.toString = function toString () {\n  var length = this.length | 0\n  if (length === 0) return ''\n  if (arguments.length === 0) return utf8Slice(this, 0, length)\n  return slowToString.apply(this, arguments)\n}\n\nBuffer.prototype.equals = function equals (b) {\n  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')\n  if (this === b) return true\n  return Buffer.compare(this, b) === 0\n}\n\nBuffer.prototype.inspect = function inspect () {\n  var str = ''\n  var max = exports.INSPECT_MAX_BYTES\n  if (this.length > 0) {\n    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')\n    if (this.length > max) str += ' ... '\n  }\n  return '<Buffer ' + str + '>'\n}\n\nBuffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {\n  if (!Buffer.isBuffer(target)) {\n    throw new TypeError('Argument must be a Buffer')\n  }\n\n  if (start === undefined) {\n    start = 0\n  }\n  if (end === undefined) {\n    end = target ? target.length : 0\n  }\n  if (thisStart === undefined) {\n    thisStart = 0\n  }\n  if (thisEnd === undefined) {\n    thisEnd = this.length\n  }\n\n  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {\n    throw new RangeError('out of range index')\n  }\n\n  if (thisStart >= thisEnd && start >= end) {\n    return 0\n  }\n  if (thisStart >= thisEnd) {\n    return -1\n  }\n  if (start >= end) {\n    return 1\n  }\n\n  start >>>= 0\n  end >>>= 0\n  thisStart >>>= 0\n  thisEnd >>>= 0\n\n  if (this === target) return 0\n\n  var x = thisEnd - thisStart\n  var y = end - start\n  var len = Math.min(x, y)\n\n  var thisCopy = this.slice(thisStart, thisEnd)\n  var targetCopy = target.slice(start, end)\n\n  for (var i = 0; i < len; ++i) {\n    if (thisCopy[i] !== targetCopy[i]) {\n      x = thisCopy[i]\n      y = targetCopy[i]\n      break\n    }\n  }\n\n  if (x < y) return -1\n  if (y < x) return 1\n  return 0\n}\n\n// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,\n// OR the last index of `val` in `buffer` at offset <= `byteOffset`.\n//\n// Arguments:\n// - buffer - a Buffer to search\n// - val - a string, Buffer, or number\n// - byteOffset - an index into `buffer`; will be clamped to an int32\n// - encoding - an optional encoding, relevant is val is a string\n// - dir - true for indexOf, false for lastIndexOf\nfunction bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {\n  // Empty buffer means no match\n  if (buffer.length === 0) return -1\n\n  // Normalize byteOffset\n  if (typeof byteOffset === 'string') {\n    encoding = byteOffset\n    byteOffset = 0\n  } else if (byteOffset > 0x7fffffff) {\n    byteOffset = 0x7fffffff\n  } else if (byteOffset < -0x80000000) {\n    byteOffset = -0x80000000\n  }\n  byteOffset = +byteOffset  // Coerce to Number.\n  if (isNaN(byteOffset)) {\n    // byteOffset: it it's undefined, null, NaN, \"foo\", etc, search whole buffer\n    byteOffset = dir ? 0 : (buffer.length - 1)\n  }\n\n  // Normalize byteOffset: negative offsets start from the end of the buffer\n  if (byteOffset < 0) byteOffset = buffer.length + byteOffset\n  if (byteOffset >= buffer.length) {\n    if (dir) return -1\n    else byteOffset = buffer.length - 1\n  } else if (byteOffset < 0) {\n    if (dir) byteOffset = 0\n    else return -1\n  }\n\n  // Normalize val\n  if (typeof val === 'string') {\n    val = Buffer.from(val, encoding)\n  }\n\n  // Finally, search either indexOf (if dir is true) or lastIndexOf\n  if (Buffer.isBuffer(val)) {\n    // Special case: looking for empty string/buffer always fails\n    if (val.length === 0) {\n      return -1\n    }\n    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)\n  } else if (typeof val === 'number') {\n    val = val & 0xFF // Search for a byte value [0-255]\n    if (Buffer.TYPED_ARRAY_SUPPORT &&\n        typeof Uint8Array.prototype.indexOf === 'function') {\n      if (dir) {\n        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)\n      } else {\n        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)\n      }\n    }\n    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)\n  }\n\n  throw new TypeError('val must be string, number or Buffer')\n}\n\nfunction arrayIndexOf (arr, val, byteOffset, encoding, dir) {\n  var indexSize = 1\n  var arrLength = arr.length\n  var valLength = val.length\n\n  if (encoding !== undefined) {\n    encoding = String(encoding).toLowerCase()\n    if (encoding === 'ucs2' || encoding === 'ucs-2' ||\n        encoding === 'utf16le' || encoding === 'utf-16le') {\n      if (arr.length < 2 || val.length < 2) {\n        return -1\n      }\n      indexSize = 2\n      arrLength /= 2\n      valLength /= 2\n      byteOffset /= 2\n    }\n  }\n\n  function read (buf, i) {\n    if (indexSize === 1) {\n      return buf[i]\n    } else {\n      return buf.readUInt16BE(i * indexSize)\n    }\n  }\n\n  var i\n  if (dir) {\n    var foundIndex = -1\n    for (i = byteOffset; i < arrLength; i++) {\n      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {\n        if (foundIndex === -1) foundIndex = i\n        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize\n      } else {\n        if (foundIndex !== -1) i -= i - foundIndex\n        foundIndex = -1\n      }\n    }\n  } else {\n    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength\n    for (i = byteOffset; i >= 0; i--) {\n      var found = true\n      for (var j = 0; j < valLength; j++) {\n        if (read(arr, i + j) !== read(val, j)) {\n          found = false\n          break\n        }\n      }\n      if (found) return i\n    }\n  }\n\n  return -1\n}\n\nBuffer.prototype.includes = function includes (val, byteOffset, encoding) {\n  return this.indexOf(val, byteOffset, encoding) !== -1\n}\n\nBuffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {\n  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)\n}\n\nBuffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {\n  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)\n}\n\nfunction hexWrite (buf, string, offset, length) {\n  offset = Number(offset) || 0\n  var remaining = buf.length - offset\n  if (!length) {\n    length = remaining\n  } else {\n    length = Number(length)\n    if (length > remaining) {\n      length = remaining\n    }\n  }\n\n  // must be an even number of digits\n  var strLen = string.length\n  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')\n\n  if (length > strLen / 2) {\n    length = strLen / 2\n  }\n  for (var i = 0; i < length; ++i) {\n    var parsed = parseInt(string.substr(i * 2, 2), 16)\n    if (isNaN(parsed)) return i\n    buf[offset + i] = parsed\n  }\n  return i\n}\n\nfunction utf8Write (buf, string, offset, length) {\n  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nfunction asciiWrite (buf, string, offset, length) {\n  return blitBuffer(asciiToBytes(string), buf, offset, length)\n}\n\nfunction latin1Write (buf, string, offset, length) {\n  return asciiWrite(buf, string, offset, length)\n}\n\nfunction base64Write (buf, string, offset, length) {\n  return blitBuffer(base64ToBytes(string), buf, offset, length)\n}\n\nfunction ucs2Write (buf, string, offset, length) {\n  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)\n}\n\nBuffer.prototype.write = function write (string, offset, length, encoding) {\n  // Buffer#write(string)\n  if (offset === undefined) {\n    encoding = 'utf8'\n    length = this.length\n    offset = 0\n  // Buffer#write(string, encoding)\n  } else if (length === undefined && typeof offset === 'string') {\n    encoding = offset\n    length = this.length\n    offset = 0\n  // Buffer#write(string, offset[, length][, encoding])\n  } else if (isFinite(offset)) {\n    offset = offset | 0\n    if (isFinite(length)) {\n      length = length | 0\n      if (encoding === undefined) encoding = 'utf8'\n    } else {\n      encoding = length\n      length = undefined\n    }\n  // legacy write(string, encoding, offset, length) - remove in v0.13\n  } else {\n    throw new Error(\n      'Buffer.write(string, encoding, offset[, length]) is no longer supported'\n    )\n  }\n\n  var remaining = this.length - offset\n  if (length === undefined || length > remaining) length = remaining\n\n  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {\n    throw new RangeError('Attempt to write outside buffer bounds')\n  }\n\n  if (!encoding) encoding = 'utf8'\n\n  var loweredCase = false\n  for (;;) {\n    switch (encoding) {\n      case 'hex':\n        return hexWrite(this, string, offset, length)\n\n      case 'utf8':\n      case 'utf-8':\n        return utf8Write(this, string, offset, length)\n\n      case 'ascii':\n        return asciiWrite(this, string, offset, length)\n\n      case 'latin1':\n      case 'binary':\n        return latin1Write(this, string, offset, length)\n\n      case 'base64':\n        // Warning: maxLength not taken into account in base64Write\n        return base64Write(this, string, offset, length)\n\n      case 'ucs2':\n      case 'ucs-2':\n      case 'utf16le':\n      case 'utf-16le':\n        return ucs2Write(this, string, offset, length)\n\n      default:\n        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)\n        encoding = ('' + encoding).toLowerCase()\n        loweredCase = true\n    }\n  }\n}\n\nBuffer.prototype.toJSON = function toJSON () {\n  return {\n    type: 'Buffer',\n    data: Array.prototype.slice.call(this._arr || this, 0)\n  }\n}\n\nfunction base64Slice (buf, start, end) {\n  if (start === 0 && end === buf.length) {\n    return base64.fromByteArray(buf)\n  } else {\n    return base64.fromByteArray(buf.slice(start, end))\n  }\n}\n\nfunction utf8Slice (buf, start, end) {\n  end = Math.min(buf.length, end)\n  var res = []\n\n  var i = start\n  while (i < end) {\n    var firstByte = buf[i]\n    var codePoint = null\n    var bytesPerSequence = (firstByte > 0xEF) ? 4\n      : (firstByte > 0xDF) ? 3\n      : (firstByte > 0xBF) ? 2\n      : 1\n\n    if (i + bytesPerSequence <= end) {\n      var secondByte, thirdByte, fourthByte, tempCodePoint\n\n      switch (bytesPerSequence) {\n        case 1:\n          if (firstByte < 0x80) {\n            codePoint = firstByte\n          }\n          break\n        case 2:\n          secondByte = buf[i + 1]\n          if ((secondByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)\n            if (tempCodePoint > 0x7F) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 3:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)\n            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {\n              codePoint = tempCodePoint\n            }\n          }\n          break\n        case 4:\n          secondByte = buf[i + 1]\n          thirdByte = buf[i + 2]\n          fourthByte = buf[i + 3]\n          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {\n            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)\n            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {\n              codePoint = tempCodePoint\n            }\n          }\n      }\n    }\n\n    if (codePoint === null) {\n      // we did not generate a valid codePoint so insert a\n      // replacement char (U+FFFD) and advance only 1 byte\n      codePoint = 0xFFFD\n      bytesPerSequence = 1\n    } else if (codePoint > 0xFFFF) {\n      // encode to utf16 (surrogate pair dance)\n      codePoint -= 0x10000\n      res.push(codePoint >>> 10 & 0x3FF | 0xD800)\n      codePoint = 0xDC00 | codePoint & 0x3FF\n    }\n\n    res.push(codePoint)\n    i += bytesPerSequence\n  }\n\n  return decodeCodePointsArray(res)\n}\n\n// Based on http://stackoverflow.com/a/22747272/680742, the browser with\n// the lowest limit is Chrome, with 0x10000 args.\n// We go 1 magnitude less, for safety\nvar MAX_ARGUMENTS_LENGTH = 0x1000\n\nfunction decodeCodePointsArray (codePoints) {\n  var len = codePoints.length\n  if (len <= MAX_ARGUMENTS_LENGTH) {\n    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()\n  }\n\n  // Decode in chunks to avoid \"call stack size exceeded\".\n  var res = ''\n  var i = 0\n  while (i < len) {\n    res += String.fromCharCode.apply(\n      String,\n      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)\n    )\n  }\n  return res\n}\n\nfunction asciiSlice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; ++i) {\n    ret += String.fromCharCode(buf[i] & 0x7F)\n  }\n  return ret\n}\n\nfunction latin1Slice (buf, start, end) {\n  var ret = ''\n  end = Math.min(buf.length, end)\n\n  for (var i = start; i < end; ++i) {\n    ret += String.fromCharCode(buf[i])\n  }\n  return ret\n}\n\nfunction hexSlice (buf, start, end) {\n  var len = buf.length\n\n  if (!start || start < 0) start = 0\n  if (!end || end < 0 || end > len) end = len\n\n  var out = ''\n  for (var i = start; i < end; ++i) {\n    out += toHex(buf[i])\n  }\n  return out\n}\n\nfunction utf16leSlice (buf, start, end) {\n  var bytes = buf.slice(start, end)\n  var res = ''\n  for (var i = 0; i < bytes.length; i += 2) {\n    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)\n  }\n  return res\n}\n\nBuffer.prototype.slice = function slice (start, end) {\n  var len = this.length\n  start = ~~start\n  end = end === undefined ? len : ~~end\n\n  if (start < 0) {\n    start += len\n    if (start < 0) start = 0\n  } else if (start > len) {\n    start = len\n  }\n\n  if (end < 0) {\n    end += len\n    if (end < 0) end = 0\n  } else if (end > len) {\n    end = len\n  }\n\n  if (end < start) end = start\n\n  var newBuf\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    newBuf = this.subarray(start, end)\n    newBuf.__proto__ = Buffer.prototype\n  } else {\n    var sliceLen = end - start\n    newBuf = new Buffer(sliceLen, undefined)\n    for (var i = 0; i < sliceLen; ++i) {\n      newBuf[i] = this[i + start]\n    }\n  }\n\n  return newBuf\n}\n\n/*\n * Need to make sure that buffer isn't trying to write out of bounds.\n */\nfunction checkOffset (offset, ext, length) {\n  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')\n  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')\n}\n\nBuffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    checkOffset(offset, byteLength, this.length)\n  }\n\n  var val = this[offset + --byteLength]\n  var mul = 1\n  while (byteLength > 0 && (mul *= 0x100)) {\n    val += this[offset + --byteLength] * mul\n  }\n\n  return val\n}\n\nBuffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  return this[offset]\n}\n\nBuffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return this[offset] | (this[offset + 1] << 8)\n}\n\nBuffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  return (this[offset] << 8) | this[offset + 1]\n}\n\nBuffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return ((this[offset]) |\n      (this[offset + 1] << 8) |\n      (this[offset + 2] << 16)) +\n      (this[offset + 3] * 0x1000000)\n}\n\nBuffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] * 0x1000000) +\n    ((this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    this[offset + 3])\n}\n\nBuffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var val = this[offset]\n  var mul = 1\n  var i = 0\n  while (++i < byteLength && (mul *= 0x100)) {\n    val += this[offset + i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) checkOffset(offset, byteLength, this.length)\n\n  var i = byteLength\n  var mul = 1\n  var val = this[offset + --i]\n  while (i > 0 && (mul *= 0x100)) {\n    val += this[offset + --i] * mul\n  }\n  mul *= 0x80\n\n  if (val >= mul) val -= Math.pow(2, 8 * byteLength)\n\n  return val\n}\n\nBuffer.prototype.readInt8 = function readInt8 (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 1, this.length)\n  if (!(this[offset] & 0x80)) return (this[offset])\n  return ((0xff - this[offset] + 1) * -1)\n}\n\nBuffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset] | (this[offset + 1] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 2, this.length)\n  var val = this[offset + 1] | (this[offset] << 8)\n  return (val & 0x8000) ? val | 0xFFFF0000 : val\n}\n\nBuffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset]) |\n    (this[offset + 1] << 8) |\n    (this[offset + 2] << 16) |\n    (this[offset + 3] << 24)\n}\n\nBuffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n\n  return (this[offset] << 24) |\n    (this[offset + 1] << 16) |\n    (this[offset + 2] << 8) |\n    (this[offset + 3])\n}\n\nBuffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, true, 23, 4)\n}\n\nBuffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 4, this.length)\n  return ieee754.read(this, offset, false, 23, 4)\n}\n\nBuffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, true, 52, 8)\n}\n\nBuffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {\n  if (!noAssert) checkOffset(offset, 8, this.length)\n  return ieee754.read(this, offset, false, 52, 8)\n}\n\nfunction checkInt (buf, value, offset, ext, max, min) {\n  if (!Buffer.isBuffer(buf)) throw new TypeError('\"buffer\" argument must be a Buffer instance')\n  if (value > max || value < min) throw new RangeError('\"value\" argument is out of bounds')\n  if (offset + ext > buf.length) throw new RangeError('Index out of range')\n}\n\nBuffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    var maxBytes = Math.pow(2, 8 * byteLength) - 1\n    checkInt(this, value, offset, byteLength, maxBytes, 0)\n  }\n\n  var mul = 1\n  var i = 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  byteLength = byteLength | 0\n  if (!noAssert) {\n    var maxBytes = Math.pow(2, 8 * byteLength) - 1\n    checkInt(this, value, offset, byteLength, maxBytes, 0)\n  }\n\n  var i = byteLength - 1\n  var mul = 1\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    this[offset + i] = (value / mul) & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  this[offset] = (value & 0xff)\n  return offset + 1\n}\n\nfunction objectWriteUInt16 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {\n    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>\n      (littleEndian ? i : 1 - i) * 8\n  }\n}\n\nBuffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = (value & 0xff)\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nfunction objectWriteUInt32 (buf, value, offset, littleEndian) {\n  if (value < 0) value = 0xffffffff + value + 1\n  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {\n    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff\n  }\n}\n\nBuffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset + 3] = (value >>> 24)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 1] = (value >>> 8)\n    this[offset] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = 0\n  var mul = 1\n  var sub = 0\n  this[offset] = value & 0xFF\n  while (++i < byteLength && (mul *= 0x100)) {\n    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {\n      sub = 1\n    }\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) {\n    var limit = Math.pow(2, 8 * byteLength - 1)\n\n    checkInt(this, value, offset, byteLength, limit - 1, -limit)\n  }\n\n  var i = byteLength - 1\n  var mul = 1\n  var sub = 0\n  this[offset + i] = value & 0xFF\n  while (--i >= 0 && (mul *= 0x100)) {\n    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {\n      sub = 1\n    }\n    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF\n  }\n\n  return offset + byteLength\n}\n\nBuffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)\n  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)\n  if (value < 0) value = 0xff + value + 1\n  this[offset] = (value & 0xff)\n  return offset + 1\n}\n\nBuffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n  } else {\n    objectWriteUInt16(this, value, offset, true)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 8)\n    this[offset + 1] = (value & 0xff)\n  } else {\n    objectWriteUInt16(this, value, offset, false)\n  }\n  return offset + 2\n}\n\nBuffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value & 0xff)\n    this[offset + 1] = (value >>> 8)\n    this[offset + 2] = (value >>> 16)\n    this[offset + 3] = (value >>> 24)\n  } else {\n    objectWriteUInt32(this, value, offset, true)\n  }\n  return offset + 4\n}\n\nBuffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {\n  value = +value\n  offset = offset | 0\n  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)\n  if (value < 0) value = 0xffffffff + value + 1\n  if (Buffer.TYPED_ARRAY_SUPPORT) {\n    this[offset] = (value >>> 24)\n    this[offset + 1] = (value >>> 16)\n    this[offset + 2] = (value >>> 8)\n    this[offset + 3] = (value & 0xff)\n  } else {\n    objectWriteUInt32(this, value, offset, false)\n  }\n  return offset + 4\n}\n\nfunction checkIEEE754 (buf, value, offset, ext, max, min) {\n  if (offset + ext > buf.length) throw new RangeError('Index out of range')\n  if (offset < 0) throw new RangeError('Index out of range')\n}\n\nfunction writeFloat (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 23, 4)\n  return offset + 4\n}\n\nBuffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {\n  return writeFloat(this, value, offset, false, noAssert)\n}\n\nfunction writeDouble (buf, value, offset, littleEndian, noAssert) {\n  if (!noAssert) {\n    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)\n  }\n  ieee754.write(buf, value, offset, littleEndian, 52, 8)\n  return offset + 8\n}\n\nBuffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, true, noAssert)\n}\n\nBuffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {\n  return writeDouble(this, value, offset, false, noAssert)\n}\n\n// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)\nBuffer.prototype.copy = function copy (target, targetStart, start, end) {\n  if (!start) start = 0\n  if (!end && end !== 0) end = this.length\n  if (targetStart >= target.length) targetStart = target.length\n  if (!targetStart) targetStart = 0\n  if (end > 0 && end < start) end = start\n\n  // Copy 0 bytes; we're done\n  if (end === start) return 0\n  if (target.length === 0 || this.length === 0) return 0\n\n  // Fatal error conditions\n  if (targetStart < 0) {\n    throw new RangeError('targetStart out of bounds')\n  }\n  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')\n  if (end < 0) throw new RangeError('sourceEnd out of bounds')\n\n  // Are we oob?\n  if (end > this.length) end = this.length\n  if (target.length - targetStart < end - start) {\n    end = target.length - targetStart + start\n  }\n\n  var len = end - start\n  var i\n\n  if (this === target && start < targetStart && targetStart < end) {\n    // descending copy from end\n    for (i = len - 1; i >= 0; --i) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {\n    // ascending copy from start\n    for (i = 0; i < len; ++i) {\n      target[i + targetStart] = this[i + start]\n    }\n  } else {\n    Uint8Array.prototype.set.call(\n      target,\n      this.subarray(start, start + len),\n      targetStart\n    )\n  }\n\n  return len\n}\n\n// Usage:\n//    buffer.fill(number[, offset[, end]])\n//    buffer.fill(buffer[, offset[, end]])\n//    buffer.fill(string[, offset[, end]][, encoding])\nBuffer.prototype.fill = function fill (val, start, end, encoding) {\n  // Handle string cases:\n  if (typeof val === 'string') {\n    if (typeof start === 'string') {\n      encoding = start\n      start = 0\n      end = this.length\n    } else if (typeof end === 'string') {\n      encoding = end\n      end = this.length\n    }\n    if (val.length === 1) {\n      var code = val.charCodeAt(0)\n      if (code < 256) {\n        val = code\n      }\n    }\n    if (encoding !== undefined && typeof encoding !== 'string') {\n      throw new TypeError('encoding must be a string')\n    }\n    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {\n      throw new TypeError('Unknown encoding: ' + encoding)\n    }\n  } else if (typeof val === 'number') {\n    val = val & 255\n  }\n\n  // Invalid ranges are not set to a default, so can range check early.\n  if (start < 0 || this.length < start || this.length < end) {\n    throw new RangeError('Out of range index')\n  }\n\n  if (end <= start) {\n    return this\n  }\n\n  start = start >>> 0\n  end = end === undefined ? this.length : end >>> 0\n\n  if (!val) val = 0\n\n  var i\n  if (typeof val === 'number') {\n    for (i = start; i < end; ++i) {\n      this[i] = val\n    }\n  } else {\n    var bytes = Buffer.isBuffer(val)\n      ? val\n      : utf8ToBytes(new Buffer(val, encoding).toString())\n    var len = bytes.length\n    for (i = 0; i < end - start; ++i) {\n      this[i + start] = bytes[i % len]\n    }\n  }\n\n  return this\n}\n\n// HELPER FUNCTIONS\n// ================\n\nvar INVALID_BASE64_RE = /[^+\\/0-9A-Za-z-_]/g\n\nfunction base64clean (str) {\n  // Node strips out invalid characters like \\n and \\t from the string, base64-js does not\n  str = stringtrim(str).replace(INVALID_BASE64_RE, '')\n  // Node converts strings with length < 2 to ''\n  if (str.length < 2) return ''\n  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not\n  while (str.length % 4 !== 0) {\n    str = str + '='\n  }\n  return str\n}\n\nfunction stringtrim (str) {\n  if (str.trim) return str.trim()\n  return str.replace(/^\\s+|\\s+$/g, '')\n}\n\nfunction toHex (n) {\n  if (n < 16) return '0' + n.toString(16)\n  return n.toString(16)\n}\n\nfunction utf8ToBytes (string, units) {\n  units = units || Infinity\n  var codePoint\n  var length = string.length\n  var leadSurrogate = null\n  var bytes = []\n\n  for (var i = 0; i < length; ++i) {\n    codePoint = string.charCodeAt(i)\n\n    // is surrogate component\n    if (codePoint > 0xD7FF && codePoint < 0xE000) {\n      // last char was a lead\n      if (!leadSurrogate) {\n        // no lead yet\n        if (codePoint > 0xDBFF) {\n          // unexpected trail\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        } else if (i + 1 === length) {\n          // unpaired lead\n          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n          continue\n        }\n\n        // valid lead\n        leadSurrogate = codePoint\n\n        continue\n      }\n\n      // 2 leads in a row\n      if (codePoint < 0xDC00) {\n        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n        leadSurrogate = codePoint\n        continue\n      }\n\n      // valid surrogate pair\n      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000\n    } else if (leadSurrogate) {\n      // valid bmp char, but last char was a lead\n      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)\n    }\n\n    leadSurrogate = null\n\n    // encode utf8\n    if (codePoint < 0x80) {\n      if ((units -= 1) < 0) break\n      bytes.push(codePoint)\n    } else if (codePoint < 0x800) {\n      if ((units -= 2) < 0) break\n      bytes.push(\n        codePoint >> 0x6 | 0xC0,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x10000) {\n      if ((units -= 3) < 0) break\n      bytes.push(\n        codePoint >> 0xC | 0xE0,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else if (codePoint < 0x110000) {\n      if ((units -= 4) < 0) break\n      bytes.push(\n        codePoint >> 0x12 | 0xF0,\n        codePoint >> 0xC & 0x3F | 0x80,\n        codePoint >> 0x6 & 0x3F | 0x80,\n        codePoint & 0x3F | 0x80\n      )\n    } else {\n      throw new Error('Invalid code point')\n    }\n  }\n\n  return bytes\n}\n\nfunction asciiToBytes (str) {\n  var byteArray = []\n  for (var i = 0; i < str.length; ++i) {\n    // Node's code seems to be doing this and not & 0x7F..\n    byteArray.push(str.charCodeAt(i) & 0xFF)\n  }\n  return byteArray\n}\n\nfunction utf16leToBytes (str, units) {\n  var c, hi, lo\n  var byteArray = []\n  for (var i = 0; i < str.length; ++i) {\n    if ((units -= 2) < 0) break\n\n    c = str.charCodeAt(i)\n    hi = c >> 8\n    lo = c % 256\n    byteArray.push(lo)\n    byteArray.push(hi)\n  }\n\n  return byteArray\n}\n\nfunction base64ToBytes (str) {\n  return base64.toByteArray(base64clean(str))\n}\n\nfunction blitBuffer (src, dst, offset, length) {\n  for (var i = 0; i < length; ++i) {\n    if ((i + offset >= dst.length) || (i >= src.length)) break\n    dst[i + offset] = src[i]\n  }\n  return i\n}\n\nfunction isnan (val) {\n  return val !== val // eslint-disable-line no-self-compare\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/node-libs-browser/node_modules/buffer/index.js?");

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//# sourceURL=webpack:///./node_modules/process/browser.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ }),

/***/ "./project/pluginFile/injectScript.ts":
/*!********************************************!*\
  !*** ./project/pluginFile/injectScript.ts ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var _polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @polkadot/extension-base/page */ \"./node_modules/@polkadot/extension-base/page/index.js\");\n/* harmony import */ var _polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _polkadot_extension_inject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @polkadot/extension-inject */ \"./node_modules/@polkadot/extension-inject/index.js\");\n/* harmony import */ var _polkadot_extension_inject__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_polkadot_extension_inject__WEBPACK_IMPORTED_MODULE_1__);\n// Copyright 2019-2021 @polkadot/extension authors & contributors\r\n// SPDX-License-Identifier: Apache-2.0\r\n\r\n\r\n// setup a response listener (events created by the loader for extension responses)\r\nwindow.addEventListener('message', ({ data, source }) => {\r\n    // only allow messages from our window, by the loader\r\n    if (source !== window || data.origin !== 'content') {\r\n        return;\r\n    }\r\n    if (data.id) {\r\n        // eslint-disable-next-line @typescript-eslint/no-explicit-any\r\n        Object(_polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0__[\"handleResponse\"])(data);\r\n    }\r\n    else {\r\n        console.error('Missing id for response.');\r\n    }\r\n});\r\nObject(_polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0__[\"redirectIfPhishing\"])().then((gotRedirected) => {\r\n    if (!gotRedirected) {\r\n        inject();\r\n    }\r\n}).catch((e) => {\r\n    console.warn(`Unable to determine if the site is in the phishing list: ${e.message}`);\r\n    inject();\r\n});\r\nfunction inject() {\r\n    console.log('enter enable');\r\n    Object(_polkadot_extension_inject__WEBPACK_IMPORTED_MODULE_1__[\"injectExtension\"])(_polkadot_extension_base_page__WEBPACK_IMPORTED_MODULE_0__[\"enable\"], {\r\n        name: 'polkadot-js',\r\n        version: process.env.PKG_VERSION\r\n    });\r\n}\r\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ \"./node_modules/process/browser.js\")))\n\n//# sourceURL=webpack:///./project/pluginFile/injectScript.ts?");

/***/ }),

/***/ 1:
/*!************************!*\
  !*** buffer (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///buffer_(ignored)?");

/***/ }),

/***/ 13:
/*!**************************************************!*\
  !*** multi ./project/pluginFile/injectScript.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./project/pluginFile/injectScript.ts */\"./project/pluginFile/injectScript.ts\");\n\n\n//# sourceURL=webpack:///multi_./project/pluginFile/injectScript.ts?");

/***/ })

/******/ });