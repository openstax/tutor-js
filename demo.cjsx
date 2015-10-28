React = require 'react'
Demo = require './src/exercise'

{loadAPISettings} = require './src/api/helper'
{api} = require './src/settings'

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  mainDiv = document.createElement('div')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)

  loadAPISettings(api)

  React.render(<Demo/>, mainDiv)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
