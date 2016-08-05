webpack = require 'webpack'
webpackUMDExternal = require 'webpack-umd-external'

# likely won't need any of this production stuffs since
# we won't be building shared separately anymore.
module.exports =
  entry:
    main: 'index'
  output:
    filename: 'main.min.js'
  externals: webpackUMDExternal(
    react: 'React'
    'react/addons': 'React.addons'
    'react-bootstrap': 'ReactBootstrap'
    'react-scroll-components': 'ReactScrollComponents'
    underscore: '_'
  )
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react/addons'
      _: 'underscore'
      BS: 'react-bootstrap'
    })
  ]