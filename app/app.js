/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import ReduxToastr from 'react-redux-toastr';
import ScrollMemory from 'react-router-scroll-memory';

import ConnectedRouter from 'components/ConnectedRouter';

import App from 'containers/App';

// Import styles
import 'styles/all.scss';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess';
import 'file-loader?name=[name].[ext]!./robots.txt';
import 'file-loader?name=[name].[ext]!pace-js/pace.min.js';
/* eslint-enable import/no-unresolved, import/extensions */

// Observe loading of web font (to remove it, remove the <link> tag in
// the index.html file and this observer)
const primaryFontObserver = new FontFaceObserver('Futura PT', {});
// When the font is loaded, add a font-family to the body
primaryFontObserver.load().then(
  () => {
    document.body.classList.add('primaryFontLoaded');
  },
  () => {
    document.body.classList.remove('primaryFontLoaded');
  }
);

const secondaryFontObserver = new FontFaceObserver('Azo Sans', {});
secondaryFontObserver.load().then(
  () => {
    document.body.classList.add('secondaryFontLoaded');
  },
  () => {
    document.body.classList.remove('secondaryFontLoaded');
  }
);

ReactDOM.render(
  <ConnectedRouter>
    <div>
      <ReduxToastr
        timeOut={3000}
        newestOnTop={false}
        preventDuplicates
        position="top-right"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
      />
      <ScrollMemory />
      <App />
    </div>
  </ConnectedRouter>,
  document.getElementById('app')
);

if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
    if (registrations && registrations.length) {
      window.location.reload(true);
    }
  });
}
