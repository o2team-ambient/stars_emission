import './utils/raf'
import {
  O2_AMBIENT_CONFIG,
  O2_AMBIENT_INIT,
  O2_AMBIENT_MAIN
} from './utils/const'
import StarsEmmision from './components/stars_emmision'

export default function initAmbient () {
  const opts = window[O2_AMBIENT_CONFIG]
  const starsEmmision = new StarsEmmision(opts)
  window[O2_AMBIENT_MAIN] = starsEmmision
  return starsEmmision
}

window[O2_AMBIENT_INIT] = initAmbient
