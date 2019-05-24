const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const isLocalDev = process.env.NODE_ENV === 'dev'

const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const config = {
  entry: {
    main: ['./src/components/index.tsx'],
    story: ['./src/story/index.tsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  // devtool: 'source-map',
  devServer: {
    hot: true,
    port: 9002,
    compress: false,
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-react',
              '@babel/preset-env',
            ],
            plugins: [
              "@babel/plugin-proposal-function-bind",
              "@babel/plugin-proposal-class-properties",
            ]
          }
        },
        // exclude: /node_modules/,
        exclude: [
          /node_modules\/(?!(react-gm|gm-util)\/).*/,
          path.join(__dirname, 'src/third-js')
        ],

      },
      // {
      //   test: /\.js$/,
      //   loader: 'happypack/loader?id=js',
      //   exclude: [
      //     /node_modules\/(?!(react-gm|ANOTHER-ONE)\/).*/,
      //     path.join(__dirname, 'src/third-js')
      //   ],
      //   options: {
      //     presets: [
      //       '@babel/preset-env',
      //       '@babel/preset-react',
      //     ]
      //   }
      //   // include: [ path.join(__dirname, 'node_modules/react-gm') ]
      // },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /(fontawesome-webfont|glyphicons-halflings-regular|iconfont)\.(woff|woff2|ttf|eot|svg)($|\?)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'font/[name].[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.tsx',
      '.ts'
    ]
  },
  plugins: [
    // new HappyPack({
    //   id: 'js',
    //   threadPool: happyThreadPool,
    //   loaders: [{
    //     path: 'babel-loader',
    //     query: { cacheDirectory: true }
    //   }]
    // }),
    // new HardSourceWebpackPlugin(), // https://github.com/mzgoddard/hard-source-webpack-plugin#hot-reloading-is-not-working
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new LodashModuleReplacementPlugin,
    new HtmlWebpackPlugin({
      inject: false,
      appMountId: 'app',
      template: require('html-webpack-template'),
    }),
    // [NOTICE] this dllplugin cannot work with dev-server
    // new webpack.DllPlugin({
    //   context: __dirname,
    // 	name: "[name]_[hash]",
    // 	path: path.join(__dirname, "dist/dll", "[name]-manifest.json"),
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   sourceMap: true,
    //   include: /\.min\.js$/,
    // })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

module.exports = config;