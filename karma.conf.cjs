module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-jsdom-launcher',
      'karma-spec-reporter',
    ],
    files: [{ pattern: 'src/test-entry.js', watched: false }],
    preprocessors: { 'src/test-entry.js': ['webpack'] },
    webpack: {
      mode: 'development',
      devtool: false,
      module: {
        rules: [
          {
            test: /\.m?jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader',
            resolve: { fullySpecified: false },
          },
        ],
      },
      resolve: { extensions: ['.js', '.jsx'] },
    },
    reporters: ['spec'],
    browsers: ['jsdom'],
    singleRun: true,
  })
}