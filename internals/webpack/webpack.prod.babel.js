// Important modules this config uses
const CONFIG = require('../../app/conf');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webPackDefault = require('./webpack.base.babel');


const IsMinifyScripts = CONFIG.IS_MINIFY_SCRIPTS;

const webPackConfigs = webPackDefault({

  mode: 'production',
  // In production, we skip all hot-reloading stuff
  entry: [path.join(process.cwd(), CONFIG.APP.ENTRY)],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  optimization: {
    minimize: true,
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: IsMinifyScripts,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),

    new WebpackPwaManifest({
      name: "Canada's medical marijuana marketplace and community - Lift",
      short_name: 'Lift',
      description:
        'A marketplace that helps patients to explore, purchase, and consume medical cannabis in Canada.',
      background_color: '#ffffff',
      theme_color: '#00bae4',
      icons: [
        {
          src: path.resolve('app/images/favicon.png'),
          sizes: [72, 96, 120, 128, 144, 152, 167, 180, 192],
        },
      ],
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
});

if (IsMinifyScripts) {

  let cacheDir = path.join(__dirname, 'webpack-cache/uglify-cache'),
      uglifyPlugin = new UglifyJsPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 6,
      },
		cache: cacheDir,
	});

	webPackConfigs.plugins.push(uglifyPlugin);
}


module.exports = webPackConfigs;