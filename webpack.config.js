const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');


// ---------------------- WEBPACK 仅用于本地调试 ----------------------

const config = {
  entry: {
    story: ['./src/story/index.tsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
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
              "@babel/plugin-proposal-class-properties"
            ]
          }
        },
        // exclude: /node_modules/,
        exclude: [
          /node_modules\/(?!(react-gm|gm-util|gm-svg)\/).*/,
          path.join(__dirname, 'src/third-js')
        ],

      },
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
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'img/[name].[hash:8].[ext]'
          }
        }]
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