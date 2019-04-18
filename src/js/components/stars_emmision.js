import p5 from 'p5'
import { getRandom } from '../utils/util'

class StartsEmmision {
  constructor (options) {
    this.stars = []
    this.sketch = (p) => {
      p.setup = this.setup.bind(this, p)
      p.draw = this.draw.bind(this, p)
      this.p = p
    }

    this.reset(options)
  }

  init () {
    const { time } = this.options

    this.p5 && this.p5.remove()
    this.p5 = new p5(this.sketch)
    this.draw(this.p)

    clearTimeout(this.timer)
    const numReg = /^[0-9]*$/
    if (!numReg.test(time)) return
    const ms = Number(time) * 1000
    if (ms > 0) {
      this.timer = setTimeout(() => {
        this.p5.remove()
      }, ms)
    }
  }

  update (newOptions) {
    this.options = newOptions
    this.draw(this.p)
  }

  setup (p) {
    const { width, height, options } = this
    this.myCanvas = p.createCanvas(width, height)
    // p.background(255, 255, 255, 10)
    this.myCanvas.canvas.style = `pointer-events: none; position:fixed; top:0; left:50%; transform: translateX(-50%); width: ${width}px; height: ${height}px; z-index: -1`
    for (var i = 0; i < options.Points; i++) {
      this.stars[i] = new Star(width, height, options, p)
    }
  }

  draw (p) {
    if (!this.myCanvas) return
    this.myCanvas.drawingContext.clearRect(0, 0, this.width * 2, this.height * 2)
    const { options, width, height } = this
    if (options.Direction == '中心') {
      p.translate(width / 2, height / 2)
    } else if (options.Direction == '左侧') {
      p.translate(0, height / 2)
    } else if (options.Direction == '右侧') {
      p.translate(width, height / 2)
    } else if (options.Direction == '上方') {
      p.translate(width / 2, 0)
    } else if (options.Direction == '下方') {
      p.translate(width / 2, height)
    }

    for (var i = 0; i < options.Points; i++) {
      if (!this.stars[i]) {
        continue
      }
      this.stars[i].display()
      this.stars[i].update()
    }
  }

  reset (newOptions) {
    this.options = Object.assign({}, newOptions)
    let realWidth = document.documentElement.clientWidth
    let realHeight = document.documentElement.clientHeight
    let canvasWidth = parseInt(newOptions.Width, 10)
    let canvasHeight = parseInt(newOptions.Height, 10)
    if (realWidth < parseInt(newOptions.Width, 10)) {
      canvasWidth = realWidth
    }
    if (realHeight < parseInt(newOptions.Height, 10)) {
      canvasHeight = realHeight
    }
    this.width = canvasWidth
    this.height = canvasHeight
    this.init()
  }

  pause () {
    this.p5.noLoop()
  }

  replay () {
    this.p5.loop()
  }

  destroy () {
    this.p5.remove()
  }
}

class Star {
  constructor(width, height, options, p) {
    this.p = p
    this.options = options
    this.width = width
    this.height = height
    this.x = getRandom(-width, width)
    this.y = getRandom(-height, height)
    this.z = getRandom(width * 2, width * 4)
    this.pz = this.z
    this.px = this.x
    this.py = this.y

    this.form
    this.angle = 0
  }

  display () {
    const { width, height, options, p } = this
    var sx = p.map(this.x / this.z / 2, -1, 1, -width, width)
    var sy = p.map(this.y / this.z / 2, -1, 1, -height, height)

    var r = p.map(p.dist(sx, sy, this.px, this.py), 0, width * 3, options.minSize, options.maxSize)

    const percent = p.norm(p.dist(sx, sy, 0, 0), 0, options.Range)
    const from = p.color(options.Color1)
    const to = p.color(options.Color2)
    const between = p.lerpColor(from, to, percent)

    p.stroke(between)
    p.strokeWeight(r)

    if (this.z >= 1 && sx <= width && sx > -width && sy > -height && sy < height) {
      p.line(this.px, this.py, sx, sy)
      this.px = sx
      this.py = sy
    }
  }

  update () {
    const { width, height, options, p } = this
    this.z -= options.Speed
    if (this.z < 1) {
      this.z = getRandom(width * 1.5, width * 2)
      this.x = getRandom(-width, width)
      this.y = getRandom(-height * 2, height * 2)
      this.px = p.map(this.x / this.z / 2, -1, 1, -width, width)
      this.py = p.map(this.y / this.z / 2, -1, 1, -height, height)
    }
  }
}

export default StartsEmmision
