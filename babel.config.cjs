// Si se define COVERAGE, Babel agrega instrumentación para medir qué líneas
// del código ejecutan las pruebas (solo lo usa "npm run test:coverage").
const plugins = process.env.COVERAGE
  ? [['istanbul', { exclude: ['**/*.spec.*', '**/test-utils.jsx', '**/test-entry.js', '**/data/**'] }]]
  : []

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { chrome: '100' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins,
}