/**
 * COMMON WEBPACK CONFIGURATION
 */

const CONFIG = require('../../app/conf');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const IS_BUILD_SOURCE_MAP = true;


const webPackConfigs = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
    },
    options.output
  ), // Merge with env dependent settings
  optimization: options.optimization,
  node: {
    fs: 'empty',
    net: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules\/(?!(react-redux-toastr)\/).*/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader:
              options.mode === 'development'
                ? 'style-loader'
                : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: IS_BUILD_SOURCE_MAP,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_BUILD_SOURCE_MAP,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: IS_BUILD_SOURCE_MAP,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        exclude: /images/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: /sprite/,
        use: 'svg-sprite-loader',
      },
      {
        test: /\.svg$/,
        use: 'url-loader',
        exclude: /sprite/,
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(CONFIG.ENV)
      },
    }),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'main', 'jsnext:main'],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});


module.exports = webPackConfigs;