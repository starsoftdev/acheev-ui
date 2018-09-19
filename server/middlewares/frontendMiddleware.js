/* eslint-disable global-require */

const CONFIG = require('../../app/conf');
const express = require('express');
const path = require('path');
const compression = require('compression');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const mimeTypes = require('mime-types');
const sitemap = require('./sitemap');

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '');
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename));
    });
  }

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
};

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  if (CONFIG.IS_USE_PRE_RENDER_ENGINE) {

    console.log('PreRender is Enabled');

  app.use(
    require('prerender-node')
      .set('protocol', 'https')
      .set('prerenderServiceUrl', CONFIG.APP.PRE_RENDER_SERVICE_URL)
  );
  }


  app.use(compression());
  sitemap(app);

  app.use(
    publicPath,
    express.static(outputPath, {
      maxAge: '1m',
      setHeaders: (res, contentPath) => {
        // We never want to cache index.html or pace
        if (
          contentPath.includes('index.html') ||
          contentPath.includes('pace.min.js')
        ) {
          res.setHeader('Cache-Control', 'public, max-age=0');
        }
      },
    })
  );

  app.get('*', (req, res) => {
    const mimeType = mimeTypes.lookup(req.path);
    // If it's a static asset and reached this far, then it doesn't exists and we should return a hard 404
    if (mimeType) {
      res.status(404).end();
    } else {
      res.sendFile(path.resolve(outputPath, 'index.html'));
    }
  });
};

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  if (CONFIG.IS_DEV) {

	  console.log('WebPack DEV Config Loaded');

    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    addDevMiddlewares(app, webpackConfig);
  } else {

	  console.log('WebPack PROD Config Loaded');

    addProdMiddlewares(app, options);
  }

  return app;
};
