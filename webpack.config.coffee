ExtractTextPlugin = require 'extract-text-webpack-plugin'

module.exports =
  entry: "./index.coffee"
  output:
    path: 'dist'
    filename: 'tutor.js'
    pubicPath: '/dist/'

  plugins: [
    new ExtractTextPlugin("tutor.css")
  ]

  module:
    loaders: [
      { test: /\.json$/,   loader: "json-loader"       }
      { test: /\.coffee$/, loader: "coffee-loader"     }
      { test: /\.cjsx$/,   loader: "coffee-jsx-loader" }

      { test: /\.less$/,  loader: ExtractTextPlugin.extract('css!less') }

      { test: /\.(png|jpg|svg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: "url-loader?limit=30000&name=[name]-[hash].[ext]" }
   ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']

  devServer:
    contentBase: './dist'
    publicPath: '/dist/'
    noInfo: true
    hot: false
    inline: false
    port: 8000
