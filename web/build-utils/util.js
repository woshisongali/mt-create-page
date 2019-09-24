const clone = (source) => {
  let target
  if (source instanceof Array) {
    target = []
    let i = source.length
    while (i--) {
      target[i] = clone(source[i])
    }
  } else if (source instanceof Object) {
    target = {}
    for (let key in source) {
      // console.log(source[key])
      target[key] = clone(source[key])
    }
    // console.log('======')
    // console.log(target)
  } else {
    return source
  }
  return target
}

module.exports = {
  clone
}