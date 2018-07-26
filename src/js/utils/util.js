function getRandom (min, max) {
  return (Math.random() * (max - min)) + min
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomArr (arr) {
  const length = arr.length
  const idx = Math.floor(Math.random() * length)
  return arr[idx]
}

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  /* eslint-disable no-useless-escape */
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function getDevicePixelRatio () {
  let result = 1
  if (window.devicePixelRatio) {
    result = window.devicePixelRatio >= 2 ? 2 : 1
  }
  return result
}

function degToRad (deg) {
  return (Math.PI / 180) * deg
}

function radToDeg (rad) {
  return (180 / Math.PI) * rad
}

export {
  getRandom,
  getRandomInt,
  getRandomArr,
  getParameterByName,
  getDevicePixelRatio,
  degToRad,
  radToDeg
}
