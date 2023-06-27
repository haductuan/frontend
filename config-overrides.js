const webpack = require("webpack");

const path = require("path");

module.exports = function override(config, _env) {
  config.resolve.fallback = {
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    constants: require.resolve("constants-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    fs: false,
    process: false,
    readline: false,
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );
  // Make file-loader ignore WASM files
  const wasmExtensionRegExp = /\.wasm$/;
  config.resolve.extensions.push(".wasm");
  config.module.rules.forEach((rule) => {
    (rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });
  // Add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, "src"),
    use: [{ loader: require.resolve("wasm-loader"), options: {} }],
  });
  return config;
};
