webpack = require 'webpack'
webpackUMDExternal = require 'webpack-umd-external'

module.exports =
  entry:
    main: './coach/index'
  output:
    filename: 'main.min.js'
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react/addons'
      _: 'underscore'
      BS: 'react-bootstrap'
      $: 'jquery'
    })
  ]
  externals: webpackUMDExternal(
    underscore: '_'
    jquery: '$'
  )