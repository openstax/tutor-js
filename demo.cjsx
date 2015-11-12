Demo = require './src/demo'

api = require './src/api'
AUTOSHOW = false

SETTINGS =
  STUBS:
    API_BASE_URL: ''
    COLLECTION_UUID: 'C_UUID'
    MODULE_UUID: 'm_uuid'
  SERVER:
    API_BASE_URL: 'http://localhost:3001'
    COLLECTION_UUID: 'f10533ca-f803-490d-b935-88899941197f'
    MODULE_UUID: '7636a3bf-eb80-4898-8b2c-e81c1711b99f'

settings = SETTINGS.SERVER

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  Demo.init(settings.API_BASE_URL)

  Demo.on 'open', Demo.handleOpened
  Demo.on 'ui.close', Demo.handleClosed

  mainDiv = document.getElementById('react-root-container')

  buttonA = document.getElementById('launcher')
  show = ->
    Demo.open(mainDiv, collectionUUID: settings.COLLECTION_UUID, moduleUUID: settings.MODULE_UUID)
    true
  buttonA.addEventListener 'click', show
  if AUTOSHOW
    setTimeout( show, 300)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
