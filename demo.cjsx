React = require 'react'
Demo = require './src/components/demo'

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  mainDiv = document.createElement('div')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)
  React.render(<Demo/>, mainDiv)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
