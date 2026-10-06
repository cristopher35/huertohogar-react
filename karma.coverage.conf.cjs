
process.env.COVERAGE = 'true'
const base = require('./karma.conf.cjs')

module.exports = function (config) {
  base(config)
  config.set({
    plugins: [...config.plugins, 'karma-coverage'],
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'text', file: 'resumen.txt' },
      ],
    },
  })
}