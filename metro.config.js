const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'wasm' to assetExts so Metro can resolve wa-sqlite.wasm properly
config.resolver.assetExts.push('wasm');

module.exports = config;
