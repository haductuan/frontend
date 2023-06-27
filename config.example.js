// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const path = require("path");
// module.exports = function override(config, _env) {
//   config.plugins.push(
//     new CopyWebpackPlugin({
//       patterns: [
//         {
//           from: "node_modules/react-liveness/build/assets/",
//           to: "assets/",
//         },
//       ],
//     })
//   );
//   // Make file-loader ignore WASM files
//   const wasmExtensionRegExp = /\.wasm$/;
//   config.resolve.extensions.push(".wasm");
//   config.module.rules.forEach((rule) => {
//     (rule.oneOf || []).forEach((oneOf) => {
//       if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
//         oneOf.exclude.push(wasmExtensionRegExp);
//       }
//     });
//   });
//   // Add a dedicated loader for WASM
//   config.module.rules.push({
//     test: wasmExtensionRegExp,
//     include: path.resolve(__dirname, "src"),
//     use: [{ loader: require.resolve("wasm-loader"), options: {} }],
//   });
//   return config;
// };
