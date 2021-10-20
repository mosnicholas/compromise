import methods from './methods/index.js'
import model from './model/index.js'
import compute from './compute/index.js'

export default {
  compute: compute,
  methods: methods,
  model: model,
  hooks: ['alias', 'machine', 'index'],
}

// const plugin = function (world) {
//   let { methods, model, parsers } = world
//   Object.assign({}, methods, _methods)
//   Object.assign(model, _model)
//   methods.one.tokenize = tokenize
//   parsers.push('normal')
//   parsers.push('alias')
//   parsers.push('machine')
//   // extend View class
//   // addMethods(View)
// }
// export default plugin