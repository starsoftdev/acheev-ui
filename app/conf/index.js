/**
 Application Configuration File
 */

const path = require('path');
const ENVIRONMENTS = require('../enum/environments');
const DOMAIN = require('./env/domain');

const ENV = process.env;
const NODE_ENV = ENV.NODE_ENV || ENVIRONMENTS.DEV;
const isDev = NODE_ENV === ENVIRONMENTS.DEV;
const PROTOCOL = 'https';
const ROOT_DIR = process.cwd();

module.exports = {
  /** Logging */
  LOG: isDev,

  /** Application Running Environment */
  ENV: NODE_ENV,

  /** If Application Running In Development Environment. */
  IS_DEV: isDev,

  /**
   * Determine if we need to run the final result within pre-render engine.
   */
  IS_USE_PRE_RENDER_ENGINE: !isDev,

  /**
   * Determine if we need to run the final result within pre-render engine.
   */
  // Todo: OKSand, fix this, currently application fails in webpack script minification process.
  IS_MINIFY_SCRIPTS: false,

  /** If Application Running In Production Environment. */
  IS_BUILD_DEPENDENCY: ENV.BUILD_LIB ? ENV.BUILD_LIB === 'true' : false,

  /**
   * Determine if analytic service should be active.
   */
  IS_ANALYTIC: !isDev,

  /** Application Root Directory */
  ROOT: ROOT_DIR,

  /** Application Build Directory */
  BUILD_DIR: path.resolve(ROOT_DIR, 'build'),

  /** APP Configs */
  APP: {
    /** Application Name */
    NAME: 'Lift',

    /** Application Version */
    VERSION: '2.0.0',

    /** Application Main Script */
    ENTRY: 'app/app.js',

    PROTOCOL,

    /** Application Domain Name */
    DOMAIN_NAME: DOMAIN,

    /** Application Base Url */
    BASE_URL: `${PROTOCOL}://${DOMAIN}`,

    // Todo: OKsand, this need to be fixed and all assigned image url path in server need to be migrated to follow `https://cdn.${DOMAIN}`
    /** Application CDN Url */
    CDN_URL: `https://images.lift.co`,

    PRE_RENDER_SERVICE_URL: 'http://localhost:3001',

    /** New Url */
    NEWS_URL: isDev
      ? 'https://staging.news.lift.co/wp-json/wp/v2/'
      : 'https://lift.co/wp-json/wp/v2/',

    /** IP to listen on */
    IP: '0.0.0.0',

    /** Port Number To Listen To */
    PORT: 3000,
  },

  FACEBOOK: {
    APP_ID: isDev ? '281503522474141' : '126340018237719',
  },

  GOOGLE: {
    APP_ID: isDev
      ? '795550909933-bm7tbmsfsuaqe72m4l6t2e6b9vqhm27g.apps.googleusercontent.com'
      : '701436264260-lp3c1rs1l3nsfd7u5lueagap3cdd3m7q.apps.googleusercontent.com',
  },
  /** Application API */
  API: {
    /** Application API Base Url */
    // URL: `${PROTOCOL}://${DOMAIN}/api`,
    URL: isDev
      ? 'https://obejq660te.execute-api.us-west-2.amazonaws.com/dev'
      : 'https://di22th5915.execute-api.us-west-2.amazonaws.com/prod',
    RECO_URL: `${PROTOCOL}://${DOMAIN}/reco`,
  },
};
