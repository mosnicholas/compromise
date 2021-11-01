const noop = vb => vb

const simple = (vb, parsed) => {
  const { verbToInfinitive } = vb.methods.two.transform
  let str = parsed.root.text('normal')
  str = verbToInfinitive(str, vb.model)
  if (str) {
    vb = vb.replace(parsed.root, str)
  }
  vb.prepend('will')
  vb.remove(parsed.auxiliary)
  return vb
}

// 'will be walking'
const progressive = (vb, parsed) => {
  const { verbConjugate, verbToInfinitive } = vb.methods.two.transform
  let str = parsed.root.text('normal')
  str = verbToInfinitive(str, vb.model)
  if (str) {
    str = verbConjugate(str, vb.model).Gerund
    vb = vb.replace(parsed.root, str)
  }
  vb.prepend('will be')
  vb.remove(parsed.auxiliary)
  return vb
}

const forms = {
  // he walks ->
  'simple-present': simple,
  // he walked
  'simple-past': simple,
  // he will walk ->
  'simple-future': noop,

  // is walking ->
  'present-progressive': progressive,
  // was walking ->
  'past-progressive': progressive,
  // will be walking ->
  'future-progressive': noop,

  // has walked ->
  'present-perfect': vb => vb.replace('has', 'will have'),
  // had walked ->
  'past-perfect': vb => vb.replace('had', 'will have'),
  // will have walked ->
  'future-perfect': noop,

  // has been walking
  'present-perfect-progressive': vb => vb.replace('has', 'will have'),
  // had been walking
  'past-perfect-progressive': vb => vb.replace('had', 'will have'),
  // will have been ->
  'future-perfect-progressive': noop,

  // got walked ->
  // was walked ->
  // was being walked ->
  // had been walked ->
  'passive-past': vb => {
    if (vb.has('got')) {
      return vb.replace('got', 'will get')
    }
    if (vb.has('(was|were)')) {
      vb.replace('(was|were)', 'will be')
      return vb.remove('being')
    }
    if (vb.has('(have|has|had) been')) {
      return vb.replace('(have|has|had) been', 'will be')
    }
    return vb
  },
  // is being walked  ->
  'passive-present': vb => {
    vb.replace('being', 'will be')
    vb.remove('(is|are|am)')
    return vb
  },
  // will be walked ->
  'passive-future': noop,
  // would be walked ->
  'present-conditional': vb => vb.replace('would', 'will'),
  // would have been walked ->
  'past-conditional': vb => vb.replace('would', 'will'),

  // is going to drink ->
  'auxiliary-future': noop,
  // used to walk -> is walking
  // did walk -> is walking
  'auxiliary-past': vb => {
    if (vb.has('used') && vb.has('to')) {
      vb.replace('used', 'will')
      return vb.remove('to')
    }
    vb.replace('did', 'will')
    return vb
  },
  // we do walk ->
  // he does walk ->
  'auxiliary-present': vb => {
    return vb.replace('(do|does)', 'will')
  },

  // must walk ->
  'modal-infinitive': noop,
  // must have walked
  'modal-past': noop,
  // wanted to walk
  'want-infinitive': vb => {
    vb.replace('(want|wants|wanted)', 'will want')
    return vb
  },
}

const toFuture = function (vb, parsed, form) {
  // console.log(form)
  // is it already future-tense?
  if (vb.has('will') || vb.has('going to')) {
    return vb
  }
  if (forms.hasOwnProperty(form)) {
    vb = forms[form](vb, parsed)
    vb.tag('Verb').compute('chunks')
    return vb
  }
  return vb
}
export default toFuture