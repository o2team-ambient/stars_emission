import './css/base.scss'
import './css/package.scss'

import { O2_AMBIENT_CONFIG } from './js/utils/const'
import initAmbient from './js/ambient'

try {
  // 保证配置读取顺序
  let csi = setInterval(() => {
    if (!window[O2_AMBIENT_CONFIG]) return
    clearInterval(csi)
    initAmbient()
    const _mtac = {}
    (function() {
        const mta = document.createElement("script")
        mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4"
        mta.setAttribute("name", "MTAH5")
        mta.setAttribute("sid", "500690671")
        const s = document.getElementsByTagName("script")[0]
        s.parentNode.insertBefore(mta, s)
    })()
  }, 1000)
} catch (e) {
  console.log(e)
}
