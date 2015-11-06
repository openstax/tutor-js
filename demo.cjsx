Demo = require './src/demo'

api = require './src/api'

SETTINGS =
  STUBS:
    API_BASE_URL: ''
    COLLECTION_UUID: 'C_UUID'
    MODULE_UUID: 'm_uuid'
  SERVER:
    API_BASE_URL: 'http://localhost:3001'
    COLLECTION_UUID: 'f10533ca-f803-490d-b935-88899941197f'
    MODULE_UUID: '6a0568d8-23d7-439b-9a01-16e4e73886b3'

settings = SETTINGS.SERVER

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  mainDiv = document.createElement('div')
  mainDiv.classList.add('cc-demo')
  mainDiv.id = 'react-root-container'
  document.body.appendChild(mainDiv)

  Demo.init(settings.API_BASE_URL)
  Demo.open(mainDiv, collectionUUID: settings.COLLECTION_UUID, moduleUUID: settings.MODULE_UUID)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
