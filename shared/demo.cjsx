ReactHelpers = require './src/helpers/react'

#require 'react-hot-loader/patch'
# React = require 'react'

{startMathJax} = require './src/helpers/mathjax'
# In dev builds this enables hot-reloading,
# in production it simply renders the root app
# {AppContainer} = require 'react-hot-loader'
loadApp = ->
  unless document.readyState is 'interactive'
    return false

  startMathJax()

  # Both require and module.hot.accept must be passed a bare string, not variable
  Renderer = ReactHelpers.renderRoot( ->
    require('./src/components/demo')
  )
  module.hot.accept('./src/components/demo', Renderer) if module.hot
  true


loadApp() or document.addEventListener('readystatechange', loadApp)
