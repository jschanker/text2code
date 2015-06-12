"use strict";

// CommonJS module system adapted to work without reading files

function require(moduleName) {
	if(moduleName in require.cache) {
		return require.cache[moduleName].exports;
	} else {
		return {}; // module doesn't exist, no exports
	}
}

function provide(moduleName) {
	// Provide a module namespace that can be requested via require

	var exports = {};
	require.cache[moduleName] = {exports: exports};
	return require.cache[moduleName];
}

require.cache = Object.create(null);
