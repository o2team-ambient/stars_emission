/*
 * 控制面板初始化代码
 */

import dat from '@o2team/ambient-dat.gui'
import Controller from './utils/controller'
import { getParameterByName } from './utils/util'

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
         // window[O2_AMBIENT_MAIN].stopBarrager()
          this.isPaly = false
        } else {
          this.isPaly = true
          // window[O2_AMBIENT_MAIN].palyBarrager()
        }
      }
    }
  }

  // 主控制面板
  class Control extends Controller {
    constructor () {
      super()
      this.otherConfig = new OtherConfig()
      this.initBaseGUI()
      // this.initTextureGUI()
      this.isShowController && !this.isAmbientPlat && this.setBackgroundColor(this.otherConfig.backgroundColor)
    }

    initBaseGUI () {
      const config = this.config
      const otherConfig = this.otherConfig
      const gui = new dat.GUI()
      gui.add(otherConfig, 'message').name('配置面板')
      gui.add(otherConfig, 'play').name('播放 / 暂停')
      gui.add(config, 'Width').name('粒子散播宽度').min(0).max(2000).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.addColor(config, 'Color1').name('粒子颜色1').onFinishChange(val => {
        console.log(val)
      })
      gui.addColor(config, 'Color2').name('粒子颜色2').onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'Range').name('渐变色值范围').min(0).max(1000).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'Speed').name('粒子速度').min(0).max(10).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'Points').name('粒子数量').min(0).max(2000).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'maxSize').name('粒子最大尺寸').min(5).max(20).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'minSize').name('粒子最小尺寸').min(0).max(5).step(1).onFinishChange(val => {
        console.log(val)
      })
      gui.add(config, 'Direction', ['Center', 'Left', 'Right', 'Up', 'Down']).name('渐变方向').onFinishChange(val => {
        console.log(val)
      })
      this.isShowController && !this.isAmbientPlat && gui.addColor(otherConfig, 'backgroundColor').name('背景色(仅演示)').onFinishChange(val => {
        Control.setBackgroundColor(val)
      })
      this.gui = gui
      this.setGUIzIndex(2)
    }
  
    // initTextureGUI () {
    //   const gui = this.gui
    //   const textures = this.config.textures
    //   const texturesFolder = gui.addFolder('纹理')
    //   let index = 0
    //   texturesFolder.open()
  
    //   this.texturesFolder = texturesFolder
    // }

    randomData () {
      this.Color1 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)];
      this.Color2 = [getRandom(0, 255), getRandom(0, 255), getRandom(0, 255)];
      this.Speed = getRandom(10, 20);
      this.Range = getRandom(0, 400);
      this.Points = getRandom(300, 2000);
      this.maxSize = getRandom(1, 20);
      this.minSize = getRandom(1, 5);
      this.Direction = getRandom(['Center', 'Left', 'Right', 'Up', 'Down']);
  
      // color1
      const color1 = this.rgbToHex(Math.floor(this.Color1[0]), Math.floor(this.Color1[1]), Math.floor(this.Color1[2]));
      color1Control.setValue(color1);
  
      //color2
      const color2 = this.rgbToHex(Math.floor(this.Color2[0]), Math.floor(this.Color2[1]), Math.floor(this.Color2[2]));
      color2Control.setValue(color2);
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