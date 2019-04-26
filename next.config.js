
module.exports = withTypescript({
  webpack(config, options) {
    return config
  }
});

// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const withTypescript = require('@zeit/next-typescript');

// module.exports = withTypescript({
//   webpack(config, options) {
//     config.plugins.push(
//       new MiniCssExtractPlugin({
//         // Options similar to the same options in webpackOptions.output
//         // both options are optional
//         filename: '[name].css',
//         chunkFilename: '[id].css',
//       }),
//     )
//     config.module.rules = config.module.rules.concat([
//         {
//           test: /\.(js|jsx)$/,
//           use: 'babel-loader',
//           exclude: /node_modules/
//         },
//         {
//           test: /\.(ts|tsx)?$/,
//           loader: 'ts-loader',
//           exclude: /node_modules/
//         },
//         {
//           test: /\.css$/,
//           use: [
//             {
//               loader: MiniCssExtractPlugin.loader,
//             },
//             'css-loader',
//           ],
//         },
//         {
//           test: /\.less$/,
//           use: [
//             MiniCssExtractPlugin.loader,
//             'css-loader',
//             {
//               loader: 'less-loader',
//               options: {
//                 javascriptEnabled: true,
//               },
//             }
//           ]
//         },
//         {
//           test: /\.png$/,
//           use: [
//             {
//               loader: 'url-loader',
//               options: {
//                 mimetype: 'image/png'
//               }
//             }
//           ]
//         }
//       ])

//     return config
//   }
// });