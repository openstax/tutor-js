React = require 'react'
Demo = require './src/demo'

api = require './src/api'

COLLECTION_UUID = 'C_UUID'
MODULE_UUID = 'm_uuid'

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  mainDiv = document.createElement('div')
  mainDiv.classList.add('cc-demo')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)

  api.initialize()

  Demo.init()
  Demo.open(mainDiv, collectionUUID: COLLECTION_UUID, moduleUUID: MODULE_UUID)

  true

loadApp() or document.addEventListener('readystatechange', loadApp)
