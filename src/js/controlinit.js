/*
 * 控制面板初始化代码
 */

import dat from '@o2team/ambient-dat.gui'
import { O2_AMBIENT_MAIN } from './utils/const'
import Controller from './utils/controller'
import { getParameterByName, getRandom, getRandomArr } from './utils/util'

/* eslint-disable no-unused-vars */
const isLoop = getParameterByName('loop')

let controlInit = () => {
  // 非必要配置字段（仅用于展示，如背景颜色、启动/暂停）
  class OtherConfig {
    constructor () {
      this.backgroundColor = '#bddaf7'
      this.isPaly = true
      this.message = '星星发射器'
      this.play = () => {
        if (this.isPaly) {
          window[O2_AMBIENT_MAIN].pause()
          this.isPaly = false
        } else {
          this.isPaly = true
          window[O2_AMBIENT_MAIN].replay()
        }
      }
    }
  }

  // 主控制面板
  class Control extends Controller {
    constructor () {
      super()
      this.otherConfig = new OtherConfig()
      this.controls = {}
      this.initBaseGUI()
      // this.initTextureGUI()
      this.isShowController && !this.isAmbientPlat && this.setBackgroundColor(this.otherConfig.backgroundColor)
    }

    initBaseGUI () {
      const config = this.config
      const otherConfig = this.otherConfig
      config.random = () => {
        this.randomData()
      }
      const gui = new dat.GUI()
      gui.add(otherConfig, 'message').name('配置面板')
      gui.add(otherConfig, 'play').name('播放 / 暂停')
      gui.add(config, 'Width').name('粒子散播宽度').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      this.controls['Color1'] = gui.addColor(config, 'Color1').name('粒子颜色1')
      this.controls['Color2'] = gui.addColor(config, 'Color2').name('粒子颜色2')
      this.controls['Range'] = gui.add(config, 'Range', 100, 1000).name('渐变色值范围')
      this.controls['Speed'] = gui.add(config, 'Speed', 10, 40).name('粒子速度')
      this.controls['Points'] = gui.add(config, 'Points', 100, 1000).step(1).name('粒子数量').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      this.controls['maxSize'] = gui.add(config, 'maxSize', 0, 20).name('粒子最大尺寸')
      this.controls['minSize'] = gui.add(config, 'minSize', 0, 5).name('粒子最小尺寸')
      this.controls['Direction'] = gui.add(config, 'Direction', ['Center', 'Left', 'Right', 'Up', 'Down']).name('渐变方向')
      gui.add(config, 'time').step(1).name('运行时间（0为无限制）').onFinishChange(val => {
        window[O2_AMBIENT_MAIN].update(config)
      })
      gui.add(config, 'random').name('随机配置')
      gui.addColor(otherConfig, 'backgroundColor').name('背景色(仅演示)').onFinishChange(val => {
        Control.setBackgroundColor(val)
      })
      this.gui = gui
      this.setGUIzIndex(2)
    }

    randomData () {
      const { controls } = this
      const Color1 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Color2 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)]
      const Speed = getRandom(10, 40)
      const Range = getRandom(100, 1000)
      const Points = getRandom(100, 1000)
      const maxSize = getRandom(0, 20)
      const minSize = getRandom(0, 5)
      const Direction = getRandomArr(['Center', 'Left', 'Right', 'Up', 'Down'])

      // color1
      const color1 = this.rgbToHex(Math.floor(Color1[0]), Math.floor(Color1[1]), Math.floor(Color1[2]))
      controls['Color1'].setValue(color1)

      //color2
      const color2 = this.rgbToHex(Math.floor(Color2[0]), Math.floor(Color2[1]), Math.floor(Color2[2]))
      controls['Color2'].setValue(color2)

      controls['Speed'].setValue(Speed)
      controls['Range'].setValue(Range)
      controls['Points'].setValue(Points)
      controls['maxSize'].setValue(maxSize)
      controls['minSize'].setValue(minSize)
      controls['Direction'].setValue(Direction)
    }
  
    componentToHex (c) {
      const hex = c.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }
  
    rgbToHex (r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b)
    }
  }

  /* eslint-disable no-new */
  new Control()
}

export default controlInit