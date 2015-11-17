Demo = require './src/demo'

api = require './src/api'
AUTOSHOW = false

SETTINGS =
  STUBS:
    API_BASE_URL: ''
    COLLECTION_UUID: 'C_UUID'
    MODULE_UUID: 'm_uuid'
    CNX_URL: ''
  LOCAL:
    API_BASE_URL: 'http://localhost:3001'
    COLLECTION_UUID: 'f10533ca-f803-490d-b935-88899941197f'
    MODULE_UUID: '7636a3bf-eb80-4898-8b2c-e81c1711b99f'
    CNX_URL: 'http://localhost:8000'
  SERVER:
    API_BASE_URL: 'https://tutor-dev.openstax.org'
    COLLECTION_UUID: 'f10533ca-f803-490d-b935-88899941197f'
    MODULE_UUID: '7636a3bf-eb80-4898-8b2c-e81c1711b99f'
    CNX_URL: 'https://dev.cnx.org'

settings = SETTINGS.LOCAL

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  Demo.init(settings.API_BASE_URL)

  Demo.on 'open', Demo.handleOpened
  Demo.on 'ui.close', Demo.handleClosed

  mainDiv = document.getElementById('react-root-container')
  buttonA = document.getElementById('launcher')
  buttonB = document.getElementById('launcher-fake')

  demoSettings =
    collectionUUID: settings.COLLECTION_UUID
    moduleUUID: settings.MODULE_UUID
    cnxUrl: settings.CNX_URL

  show = ->
    Demo.open(mainDiv, demoSettings)
    true

  showFake = ->
    fakeSettings =
      collectionUUID: 'FAKE_COLLECTION'
      moduleUUID: 'FAKE_MODULE'
      cnxUrl: settings.CNX_URL

    Demo.open(mainDiv, fakeSettings)
    true

  buttonA.addEventListener 'click', show
  buttonB.addEventListener 'click', showFake


  # Hook in to writing view updates to history api
  Demo.on 'view.update', (eventData) ->
    if eventData.url isnt location.pathname
      history.pushState(eventData.state, null, eventData.url)

  # listen to back/forward and broadcasting to coach navigation
  window.addEventListener 'popstate', (eventData) ->
    view = Demo.getViewByUrl(location.pathname)
    if view?
      Demo.emit("show.#{view}", {view})

  # open to the expected view right away if view in url
  Demo.openByUrl(mainDiv, demoSettings, location.pathname) if location.pathname?

  if AUTOSHOW
    setTimeout( show, 300)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
