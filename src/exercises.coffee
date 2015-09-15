require 'jquery'

api = require './api'
router = require './admin-router'
dom = require './helpers/dom'
{startMathJax} = require './helpers/mathjax'
{TransitionAssistant} = require './components/unsaved-state'

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  api.start(dom.readBootstrapData())
  startMathJax()

  # This is added because MathJax puts in extra divs on initial load.
  # Moves the React Root to be an element inside a div
  # instead of the only element in the body.
  mainDiv = document.createElement('div')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)
  router.start(mainDiv)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
