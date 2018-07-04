/*
 * 控制面板
 */

import controlInit from './js/controlinit'
import {
  O2_AMBIENT_CONFIG
} from './js/utils/const'

let csi = setInterval(() => {
  if (/* !window[O2_AMBIENT_INIT] && */!window[O2_AMBIENT_CONFIG]) return
  clearInterval(csi)
  controlInit()
}, 1000)