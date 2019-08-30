/*
 * 控制面板初始化代码
 */

import dat from '@o2team/ambient-dat.gui'
import { O2_AMBIENT_MAIN, O2_AMBIENT_CONFIG } from './utils/const'
import Controller from './utils/controller'
import { getParameterByName, getRandom, getRandomArr } from './utils/util'
import configBlue from '../configs/configBlue'

/* eslint-disable no-unused-vars */
const isLoop = getParameterByName('loop')

let controlInit = () => {
  // 非必要配置字段（仅用于展示，如背景颜色、启动/暂停）
  class OtherConfig {
    constructor () {
      this.backgroundColor = '#000'
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
      this.random = () => {}
    }
  }

  // 主控制面板
  class Control extends Controller {
    colorFolder
    motionFolder
    sizeFolder

    constructor () {
      super()
      this.otherConfig = new OtherConfig()
      this.controls = {}
      this.initBaseGUI()
      this.initColorGUI()
      this.initMotionGUI()
      this.initSizeGUI()
      this.initAdvanceGUI()
      // this.initTextureGUI()
      this.isShowController && !this.isAmbientPlat && this.setBackgroundColor(this.otherConfig.backgroundColor)
    }

    initBaseGUI () {
      const config = this.config
      const otherConfig = this.otherConfig
      otherConfig.random = () => {
        this.randomData()
      }
      const gui = new dat.GUI({
        preset: 'default',
        load: {
          remembered: {
            default: {
              '0': {...window[O2_AMBIENT_CONFIG]}
            },
            blue: {
              '0': {...configBlue}
            }
          }
        }
      })
      gui.remember(config)
      gui.add(otherConfig, 'message').name('配置面板')
      gui.addColor(otherConfig, 'backgroundColor').name('背景色(仅演示)').onFinishChange(val => {
        this.setBackgroundColor(val)
      })
      // gui.add(otherConfig, 'play').name('播放 / 暂停')
      gui.add(otherConfig, 'random').name('随机配置')
      
      this.gui = gui
      this.setGUIzIndex(2)
    }

    initColorGUI () {
      this.colorFolder = this.gui.addFolder('粒子配色')

      this.controls['Color1'] = this.colorFolder
        .addColor(this.config, 'Color1')
        .name('靠近中心')
        .onChange(this.resetCanvas.bind(this))
      this.controls['alpha1'] = this.colorFolder
        .add(this.config, 'alpha1', 0, 100)
        .name('靠近中心透明度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Color2'] = this.colorFolder
        .addColor(this.config, 'Color2')
        .name('靠近外围')
        .onChange(this.resetCanvas.bind(this))
      this.controls['alpha2'] = this.colorFolder
        .add(this.config, 'alpha2', 0, 100)
        .name('靠近外围透明度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Range'] = this.colorFolder
        .add(this.config, 'Range', 100, 1000)
        .name('渐变范围')
        .onChange(this.resetCanvas.bind(this))

      this.colorFolder.open()
    }

    initMotionGUI () {
      this.motionFolder = this.gui.addFolder('粒子动态')

      this.controls['Speed'] = this.motionFolder
        .add(this.config, 'Speed', 10, 40)
        .name('粒子速度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Points'] = this.motionFolder
        .add(this.config, 'Points', 100, 1000)
        .step(1)
        .name('粒子数量')
        .onChange(this.resetCanvas.bind(this))
      // this.controls['maxSize'] = this.motionFolder
      //   .add(this.config, 'maxSize', 0, 20)
      //   .name('粒子长度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['minSize'] = this.motionFolder
        .add(this.config, 'minSize', 0, 5)
        .name('粒子宽度')
        .onChange(this.resetCanvas.bind(this))
      this.controls['Direction'] = this.motionFolder
        .add(this.config, 'Direction', ['中心', '右侧', '左侧', '下方', '上方'])
        .name('发射中心位置')
        .onChange(this.resetCanvas.bind(this))
      this.motionFolder.open()
    }

    initSizeGUI () {
      this.sizeFolder = this.gui.addFolder('画布尺寸')

      this.sizeFolder.add(this.config, 'Width')
        .name('宽度')
        .onChange(this.resetCanvas.bind(this))
      this.sizeFolder.add(this.config, 'Height')
        .name('高度')
        .onChange(this.resetCanvas.bind(this))
    }

    initAdvanceGUI () {

      this.gui.add(this.config, 'time')
        .step(1)
        .name('运行时间（秒，0为无限制）')
        .onChange(this.resetCanvas.bind(this))
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
      const Direction = getRandomArr(['中心', '右侧', '左侧', '下方', '上方'])

      // color1
      const color1 = this.rgbToHex(Math.floor(Color1[0]), Math.floor(Color1[1]), Math.floor(Color1[2]))
      controls['Color1'].setValue(color1)

      //color2
      const color2 = this.rgbToHex(Math.floor(Color2[0]), Math.floor(Color2[1]), Math.floor(Color2[2]))
      controls['Color2'].setValue(color2)

      controls['Speed'].setValue(Speed)
      controls['Range'].setValue(Range)
      controls['Points'].setValue(Points)
      // controls['maxSize'].setValue(maxSize)
      controls['minSize'].setValue(minSize)
      controls['Direction'].setValue(Direction)
      
      this.resetCanvas()
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