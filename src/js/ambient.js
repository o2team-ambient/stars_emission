import './utils/raf'
import {
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_INIT,
  O2_AMBIENT_MAIN
} from './utils/const'

function initAmbient () {
  // new XXX()
}

window[O2_AMBIENT_INIT] = initAmbient

try {
  initAmbient()
} catch (e) {
  console.log(e) 
}
