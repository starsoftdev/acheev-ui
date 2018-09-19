const COMPATIBILITY = [
  'last 2 versions',
  'ie >= 9',
  'Android >= 2.3',
  'ios >= 7',
];

module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: COMPATIBILITY }),
  ],
};
