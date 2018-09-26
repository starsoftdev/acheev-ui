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

  /**
   * Determine if contentful service should be active.
   */
  IS_CONTENTFUL: false,

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

  /**
   * Contentful configurations.
   */
  CONTENTFUL: {
    URL: 'cdn.contentful.com',

    DEFAULT: {
      // This is the space ID. A space is like a project folder in Contentful terms
      SPACE: 'i39s3xee28h4',

      // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
      ACCESS_TOKEN:
        'dcd19ccdbb394bc877ac5c91f7322aa34e8d51c02549f95a7081edb819dc2f65',
    },

    FAQ: {
      SPACE: 'je5420y7vc9t',

      ACCESS_TOKEN:
        '0ddba41af29a3166e0302b89936aa3bce1b8144b1f9b5ed7238ae092d8d58e74',
    },

    PREVIEW: {
      URL: 'preview.contentful.com',

      ACCESS_TOKEN:
        '80aa640b4621315580df92022a75a60a9ff7d9120b5afdf2a730a30197e9d617',
    },
  },

  /** Application API */
  API: {
    /** Application API Base Url */
    // URL: `${PROTOCOL}://${DOMAIN}/api`,
    URL: 'https://dtvyf9uhp1.execute-api.us-west-2.amazonaws.com/dev',
    RECO_URL: `${PROTOCOL}://${DOMAIN}/reco`,
  },
};
