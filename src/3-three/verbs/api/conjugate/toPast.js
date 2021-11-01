const fns = {

  noop: vb => vb,

  noAux: (vb, parsed) => {
    if (parsed.auxiliary.found) {
      vb = vb.remove(parsed.auxiliary)
    }
    return vb
  },

  // walk->walked
  simple: (vb, parsed) => {
    const { verbConjugate, verbToInfinitive } = vb.methods.two.transform
    let str = parsed.root.text('normal')
    str = verbToInfinitive(str, vb.model)
    let all = verbConjugate(str, vb.model)
    // 'driven' || 'drove'
    str = all.Participle || all.PastTense
    // but skip the 'is' participle..
    str = str === 'been' ? 'was' : str
    if (str) {
      vb = vb.replace(parsed.root, str).tag('Verb')
      vb.not('#Particle').tag('PastTense')
    }
    return vb
  },

  both: function (vb, parsed) {
    vb = fns.simple(vb, parsed)
    return fns.noAux(vb, parsed)
  },

  hasHad: vb => {
    vb.replace('has', 'had')
    return vb
  },

  // some verbs have this weird past-tense form
  // drive -> driven, (!drove)
  hasParticiple: (vb, parsed) => {
    const { verbConjugate, verbToInfinitive } = vb.methods.two.transform
    let str = parsed.root.text('normal')
    str = verbToInfinitive(str, vb.model)
    return verbConjugate(str, vb.model).Participle
  },

}


const forms = {
  // he walks -> he walked
  'simple-present': fns.simple,
  // he walked
  'simple-past': fns.noop,
  // he will walk -> he walked
  'simple-future': fns.both,

  // he is walking
  'present-progressive': vb => {
    vb.replace('are', 'were')
    vb.replace('(is|are|am)', 'was')
    return vb
  },
  // he was walking
  'past-progressive': fns.noop,
  // he will be walking
  'future-progressive': (vb, parsed) => {
    vb.match(parsed.root).insertBefore('was')
    vb.remove('(will|be)')
    return vb
  },

  // has walked -> had walked (?)
  'present-perfect': fns.hasHad,
  // had walked
  'past-perfect': fns.noop,
  // will have walked -> had walked
  'future-perfect': (vb, parsed) => {
    vb.match(parsed.root).insertBefore('had')
    vb.remove('(will|have)')
    return vb
  },

  // has been walking -> had been
  'present-perfect-progressive': fns.hasHad,
  // had been walking
  'past-perfect-progressive': fns.noop,
  // will have been -> had
  'future-perfect-progressive': vb => {
    vb.remove('will')
    vb.replace('have', 'had')
    return vb
  },

  // got walked
  'passive-past': vb => {
    // 'have been walked' -> 'had been walked'
    vb.replace('have', 'had')
    return vb
  },
  // is being walked  -> 'was being walked'
  'passive-present': vb => {
    vb.replace('(is|are)', 'was')
    return vb
  },
  // will be walked -> had been walked
  'passive-future': (vb, parsed) => {
    if (parsed.auxiliary.has('will be')) {
      vb.match(parsed.root).insertBefore('had been')
      vb.remove('(will|be)')
    }
    // will have been walked -> had been walked
    if (parsed.auxiliary.has('will have been')) {
      vb.replace('have', 'had')
      vb.remove('will')
    }
    return vb
  },

  // would be walked -> 'would have been walked'
  'present-conditional': vb => {
    vb.replace('be', 'have been')
    return vb
  },
  // would have been walked
  'past-conditional': fns.noop,

  // is going to drink -> was going to drink
  'auxiliary-future': vb => {
    vb.replace('(is|are|am)', 'was')
    return vb
  },
  // used to walk
  'auxiliary-past': fns.noop,
  // we do walk -> we did walk
  'auxiliary-present': vb => {
    vb.replace('(do|does)', 'did')
    return vb
  },

  // must walk -> 'must have walked'
  'modal-infinitive': (vb, parsed) => {
    // this modal has a clear tense
    if (vb.has('can')) {
      // can drive -> could drive
      vb.replace('can', 'could')
    } else {
      // otherwise, 
      //  walk -> have walked
      //  drive -> have driven
      fns.simple(vb, parsed)
      vb.match('#Modal').insertAfter('have').tag('Auxiliary')
    }
    return vb
  },
  // must have walked
  'modal-past': fns.noop,
  // wanted to walk
  'want-infinitive': vb => {
    vb.replace('(want|wants)', 'wanted')
    vb.remove('will')
    return vb
  },
}

const toPast = function (vb, parsed, form) {
  // console.log(form)
  if (forms.hasOwnProperty(form)) {
    vb = forms[form](vb, parsed)
    vb.tag('Verb').compute('chunks')
    return vb
  }
  // do nothing i guess?
  return vb
}
export default toPast