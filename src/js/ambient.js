import './utils/raf'
import {
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_INIT,
  O2_AMBIENT_MAIN
} from './utils/const'
import StartsEmmision from './components/stars_emmision'

function initAmbient () {
  const opts = window[O2_AMBIENT_CONFIG]
  const startsEmmision = new StartsEmmision(opts)
  window[O2_AMBIENT_MAIN] = startsEmmision
  return startsEmmision
}

window[O2_AMBIENT_INIT] = initAmbient

try {
  let csi = setInterval(() => {
    if (!window[O2_AMBIENT_CONFIG]) return
    clearInterval(csi)
    initAmbient()
  }, 1000)
} catch (e) {
  console.log(e) 
}
