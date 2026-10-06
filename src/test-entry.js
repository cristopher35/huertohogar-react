// Punto de entrada de las pruebas: Karma carga solo este archivo.

// 1) Todas las pruebas (*.spec.js y *.spec.jsx)
const pruebas = import.meta.webpackContext('./', {
  recursive: true,
  regExp: /\.spec\.jsx?$/,
})
pruebas.keys().forEach(pruebas)

// 2) Todo el código fuente (excepto main.jsx y los archivos de prueba).
// Se importa para que el informe de cobertura incluya también los archivos
// que ninguna prueba toca, y muestre su 0% en lugar de ocultarlos.
const codigo = import.meta.webpackContext('./', {
  recursive: true,
  regExp: /^\.\/(?!main\.jsx$)(?!test-)(?!.*\.spec\.).*\.jsx?$/,
})
codigo.keys().forEach(codigo)