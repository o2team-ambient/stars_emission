import './utils/raf'
import {
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_INIT,
  O2_AMBIENT_MAIN
} from './utils/const'
import StartsEmmision from './components/start_emmision'

function initAmbient () {
  const opts = window[O2_AMBIENT_CONFIG]
  const startsEmmision = new StartsEmmision(opts)
  window[O2_AMBIENT_MAIN] = startsEmmision
  return startsEmmision
}

window[O2_AMBIENT_INIT] = initAmbient

try {
  initAmbient()
} catch (e) {
  console.log(e) 
}
