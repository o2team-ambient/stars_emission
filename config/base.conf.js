const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PWD = process.env.PWD || process.cwd()

module.exports = {
  entry: [PWD + "/demo/src/index.js"],
  output: {
    path: PWD + "/demo/dist",
    filename: "bundle.js"
  },
  // devtool: 'eval-source-map',
  devServer: {
    contentBase: "./js",
    historyApiFallback: true,
    inline: true, //实时刷新
    quiet: true,
    hot: true,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        include: /demo\/src/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 2000,
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.scss|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: {minimize: true} },
            'sass-loader', 
            {
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  require('autoprefixer')()
                ]  
              }
            }
          ]
        })
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      filename: 'index.html',
      template: './demo/src/index.html',
    })  
  ]
}