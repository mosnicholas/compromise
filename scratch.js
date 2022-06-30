/* eslint-disable no-console, no-unused-vars */
import nlp from './src/three.js'
import plg from './plugins/speed/src/plugin.js'
nlp.plugin(plg)

// nlp.verbose('tagger')

let txt = ''
let doc
// doc = nlp('33 kilos').debug()
// doc = doc.match('33 km').debug()

doc = nlp('walking')
doc.match('{walk}').debug()
console.log(nlp.parseMatch('{live/verb}'))

// console.log(doc.numbers().json())




// apostrophe
// let lex = {
//   'queen anne\'s lace': 'Flower'
// }
// let doc = nlp(`Queen Anne's lace`, lex)
// doc.match(`#Flower`).debug()
// console.log(doc.docs[0])