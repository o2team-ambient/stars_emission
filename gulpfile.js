/*
 * @Author: chenxinyi
 * @Date: 2018-06-04 15:26:18
 * @Description: 
 */
const path = require('path')
const os = require('os')
const spawn = require('child_process').spawn
const url = require('url')

const gulp = require('gulp')
const inquirer = require('inquirer')
const chalk = require('chalk')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')
const ora = require('ora')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const store = memFs.create()
const fs = editor.create(store)

const PWD = process.env.PWD || process.cwd()

/**
 * 初始化文件目录
 */
gulp.task('init', () => {
  new InitApp()
})

class InitApp {
  constructor () {
    this.author = this._getUserName()
    this.appName = PWD.split(path.sep).reverse()[0]
    this.github = `https://github.com/o2team-ambient/${this.appName}`
    this.demoUrl = `http://jdc.jd.com/demo/ambient/${this.appName}/`

    this.conf = {
      appName: this.appName,
      author: this.author,
      github: null,
      demoUrl: null
    }

    this.init()
  }

  init () {
    console.log('🙈 准备创建项目～')
    console.log()

    this._ask()
      .then(answers => {
        let confAppName = answers.appName || this.appName
        let confGithub = answers.github || this.github
        let confDemoUrl = answers.demoUrl || this.demoUrl
        this.conf = Object.assign(this.conf, {
          appName: confAppName,
          github: confGithub,
          demoUrl: confDemoUrl
        })
        
        this._create()
      })
  }

  _ask () {
    const prompts = []
    prompts.push({
      type: 'input',
      name: 'appName',
      message: chalk.green(`请输入项目名，默认为 ${this.appName}`)
    })
    prompts.push({
      type: 'input',
      name: 'github',
      message: chalk.green(`请输入github地址，默认为 ${this.github}`)
    })
    prompts.push({
      type: 'input',
      name: 'demoUrl',
      message: chalk.green(`请输入预览地址，默认为 ${this.demoUrl}`)
    })

    return inquirer.prompt(prompts)
  }

  _create () {
    console.log()  
    this.createSpinner = ora('开始创建文件').start()
    this._downloadTpl()
  }

  _getUserName () {
    const HOMEDIR = (function () {
      let homedir = null
      const env = process.env
      const home = env.HOME
      const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME
      if (process.platform === 'win32') {
        homedir = env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null
      } else if (process.platform === 'darwin') {
        homedir = home || (user ? `/Users/${user}` : null)
      } else if (process.platform === 'linux') {
        homedir = home || (process.getuid() === 0 ? '/root' : (user ? `/home/${user}` : null))
      }
      return typeof os.homedir === 'function' ? os.homedir : function () {
        return homedir
      }
    })()
    const userHome = HOMEDIR
    const systemUsername = process.env.USER || path.basename(userHome)
    return systemUsername
  }

  _downloadTpl () {
    const from = 'git@git.jd.com:o2h5/ambient-tpl.git'
    const download = spawn('git', ['clone', from, 'demo'])
    download.on('close', (code) => {
      if (!code) {
        let dirs = [
          'demo/src/index.html',
          'demo/src/js/utils/const.js',
          'demo/info.json'
        ]
        dirs.forEach(item => {
          fs.copyTpl(path.join(PWD, item), path.join(PWD, item), this.conf)
        })
        fs.commit(() => {
          this.createSpinner.stop()
          spawn('rm', ['-rf', './demo/.git'])
          spawn('rm', ['-f', './demo/.gitignore'])
          console.log(chalk.green('🙉 项目创建成功！'))
          
          this._initGit()
        })

      } else {
        this.createSpinner.stop()
        console.log(chalk.red(`模板下载失败 error status: ${code}`))  
      }
    })
  }

  _initGit () {  
    let ignoreCtn = 'node_modules/\n.git/\n.cache/\n.DS_Store\ndist/\nplugins/'

    if (fs.exists(path.join(PWD, '.gitignore'))) {
      fs.write(path.join(PWD, '.gitignore'), ignoreCtn)
      fs.commit(() => {})
    } else {
      // 添加ignore文件
      const ignoreFile = spawn('touch', ['.gitignore'])  
      ignoreFile.on('close', () => {
        fs.write(path.join(PWD, '.gitignore'), ignoreCtn)
        fs.commit(() => {})
      })
    }
    
    try {
      const gitInitTask = spawn('git', ['init'])
      gitInitTask.on('close', () => {
        const addRemoteTask = spawn('git', ['remote', 'add', 'origin', this.conf.github])
      })
    } catch (e) {
      console.log(chalk.red('git初始化失败，请手动尝试'))
    }
  }
}

/**
 * 编译 + 监听
 */
gulp.task('start', () => {
  new Serve()
})

class Serve {
  constructor () {
    this.webpackBaseConf = require(path.join(PWD, 'demo/config/base.conf.js'))
    this.webpackCustomConf = require(path.join(PWD, 'demo/config/custom.conf.js'))

    this.init()
  }

  init () {
    // this._open('localhost:8000')
    this._startServe()
  }

  _startServe () {
    process.env.NODE_ENV = 'development'

    let webpackBaseConf = this.webpackBaseConf()
    let webpackCustomConf = this.webpackCustomConf

    const port = webpackCustomConf.port || 8080
    const urls = `localhost:${port}`
    const serveSpinner = ora('正在开启服务器，请稍等🤡~').start()

    let conf = Object.assign(webpackBaseConf, webpackCustomConf.webpack)
    // if (webpackCustomConf.cdn) conf.output.publicPath = webpackCustomConf.cdn

    if (typeof conf.entry === 'array') {
      conf.entry.unshift(`webpack-dev-server/client?http://localhost:${port}`, 'webpack/hot/dev-server')
    } else if (typeof conf.entry === 'object') {
      Object.keys(conf.entry).forEach(key => {
        conf.entry[key].unshift(`webpack-dev-server/client?http://localhost:${port}`, 'webpack/hot/dev-server')
      })
    }
    
    conf.plugins.push(new Webpack.HotModuleReplacementPlugin())

    const compiler = Webpack(conf)
    const devServerConf = conf.devServer    
    const server = new WebpackDevServer(compiler, devServerConf)
    
    server.listen(port, err => {
      if (err) {
        return console.log(err)
      }
    })

    let isFirstCompile = true
    compiler.plugin('invalid', filepath => {
      console.log(chalk.grey(`修改文件: ${filepath}`))
      serveSpinner.text = '编译中...🤡~'
      serveSpinner.render()
    })
    compiler.plugin('done', stats => {
      const { errors, warnings } = stats.toJson({}, true)
      const isSuccess = !errors.length && !warnings.length
      if (isSuccess) {
        serveSpinner.succeed(chalk.green('编译成功!\n'))
      }
      if (errors.length) {
        errors.splice(1)
        serveSpinner.fail(chalk.red('编译失败!\n'))
        console.log(errors.join('\n\n'))
        console.log()
      }
      if (isFirstCompile) {
        console.log(chalk.cyan('> 监听 ' + urls))
        console.log()
        this._open(port)
        isFirstCompile = false
      }
    })
  }

  _open (port) {
    const exec = require('child_process').exec
    const __escape = (s) => {
      return s.replace(/"/g, '\\"')
    }
    let target = url.format({
      protocol: 'http',
      hostname: 'localhost',
      port,
      pathname: '/'
    })

    let opener

    switch (process.platform) {
      case 'darwin':
        opener = 'open'
        break
      case 'win32':
        opener = 'start ""'
        break
      default:
        opener = 'xdg-open ""'
        break
    }

    if (process.env.SUDO_USER) {
      opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener
    }

    return exec(opener + ' "' + __escape(target) + '"')
  }
}

/**
 * 打包 + 静态资源部署
 */
gulp.task('build', () => {
  new Build()
})
class Build {
  constructor () {
    this.infoFile = path.join(`${PWD}/demo/info.json`)
    this.htmlFile = path.join(`${PWD}/demo/src/index.html`)
    this.info = JSON.parse(fs.read(this.infoFile))
    this.htmlContent = fs.read(this.htmlFile)
    this.conf = {}
    this.webpackBaseConf = require(path.join(PWD, 'demo/config/base.conf.js'))
    this.webpackCustomConf = require(path.join(PWD, 'demo/config/custom.conf.js'))

    this.init()
  }

  async init () {
    let result = await new Promise((res, rej) => {
      this._build(res, rej)
    })

    if (!result) return

    this._ask()
    .then(answers => {
      if (!answers.accessKey) return

      this.conf.accessKey = answers.accessKey

      if (!answers.secretKey) return

      this.conf.secretKey = answers.secretKey
      this._deployResource()
    })
  }

  _ask () {
    const prompts = []
    prompts.push({
      type: 'input',
      name: 'accessKey',
      message: chalk.green(`请输入 accessKey`)
    })
    prompts.push({
      type: 'input',
      name: 'secretKey',
      message: chalk.green(`请输入 secretKey`),
      when (answers) {
        if (answers.accessKey) {
          return true
        } else {
          return false
        }
      }
    })

    return inquirer.prompt(prompts)
  }

  _build (res, rej) {
    process.env.NODE_ENV = 'production'

    let webpackBaseConf = this.webpackBaseConf()
    let webpackCustomConf = this.webpackCustomConf

    const buildSpinner = ora('正在打包资源，请稍等~').start()
    const ExtractTextPlugin = require('extract-text-webpack-plugin')
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
  
    webpackBaseConf.output.filename = `[name]-${this.info.title}.js`
    
    let conf = Object.assign(webpackBaseConf, webpackCustomConf.webpack)
    if (webpackCustomConf.cdn) conf.output.publicPath = webpackCustomConf.cdn

    conf.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 8,
          compress: {
            warnings: false
          }
        } 
      }),
      new ExtractTextPlugin(`styles-${this.info.title}.css`)
    )

    
    const compiler = Webpack(conf)

    compiler.run((err, stats) => {
      if (err) {
        return console.log(err)
        rej(0)  
      }
  
      const { errors, warnings } = stats.toJson({}, true)
      const isSuccess = !errors.length && !warnings.length
      if (isSuccess) {
        buildSpinner.succeed(chalk.green('打包成功!\n'))
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n')
        res(1)
        return
      }
      if (errors.length) {
        errors.splice(1)        
        buildSpinner.fail(chalk.red('打包失败!\n'))
        rej(0)
        return console.log(new Error(errors.join('\n\n')))  
      }
      if (warnings.length) {
        buildSpinner.warn(chalk.yellow('提醒:\n'))
        console.log(warnings.join('\n\n'))
      }
    })
  }

  _deployResource () {
    console.log('\n')
    const deploySpinner = ora('正在上传资源，请稍等~').start()
    const JFS = require('jfs-sdk-node')
    const { accessKey, secretKey } = this.conf
    const jfs = JFS.init({
      endpoint: 'http://storage.jd.com',
      credential: {
        accessKey,
        secretKey
      }
    })

    const objects = jfs.Objects('ambient')
    objects.uploadFiles([
      {
        file: `${PWD}/demo/dist/bundle-${this.info.title}.js`,
        key: `bundle-${this.info.title}.js`
      },
      {
        file: `${PWD}/demo/dist/control-${this.info.title}.js`,
        key: `control-${this.info.title}.js`
      },
      {
        file: `${PWD}/demo/dist/config-${this.info.title}.js`,
        key: `config-${this.info.title}.js`
      },
      {
        file: `${PWD}/demo/dist/styles-${this.info.title}.css`,
        key: `styles-${this.info.title}.css`
      }
    ], (err, results) => {
      deploySpinner.succeed(chalk.green('上传成功!\n'))
      this._updateInfo()
    }) 
  }

  _updateInfo () {
    let webpackCustomConf = this.webpackCustomConf
    let cdn = webpackCustomConf.cdn
    let timestamp = `?t=${Date.parse(new Date())}`
    let html = this.htmlContent.match(/<!-- S 主体内容 -->[\s\S]*<!-- E 主体内容 -->/g)
    if (!cdn) return
    this.info.demoSnippet = `<link href=\"${cdn}styles-${this.info.title}.css${timestamp}\" rel=\"stylesheet\" />${html}<script src=\"${cdn}bundle-${this.info.title}.js${timestamp}\"></script>`
    this.info.controlUrl = `${cdn}control-${this.info.title}.js${timestamp}`
    this.info.configUrl = `${cdn}config-${this.info.title}.js${timestamp}`

    fs.writeJSON(this.infoFile, this.info)
    fs.copy(this.infoFile, path.join(`${PWD}/info.json`))

    fs.commit(() => {
      console.log(chalk.green('🙉 info插入成功！'))
    })
  }
}
