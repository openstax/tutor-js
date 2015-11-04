React = require 'react'
Demo = require './src/demo'

api = require './src/api'

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  mainDiv = document.createElement('div')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)

  api.initialize()

  Demo.on('user.change', ->
    Demo.open(mainDiv)
  )
  Demo.init()

  true

loadApp() or document.addEventListener('readystatechange', loadApp)
