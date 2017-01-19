_ = require 'underscore'
ConceptCoachAPI = require './src/concept-coach'

api = require './src/api'
AUTOSHOW = false
{startMathJax, typesetMath} = require './demo-mathjax-config'

SETTINGS =
  STUBS:
    API_BASE_URL: ''
    COLLECTION_UUID: 'C_UUID'
    MODULE_UUID: 'm_uuid'
    CNX_URL: ''
  LOCAL:
    API_BASE_URL: 'http://localhost:3001'
    COLLECTION_UUID: "3402dc53-113d-45f3-954e-8d2ad1e73659"
    MODULE_UUID: '68ae7446-32b4-4cc7-89a7-4615dd20f3bd'
    CNX_URL: 'http://localhost:8000'
    # ENROLLMENT_CODE: '282589' # past
    # ENROLLMENT_CODE: 'coach awesome' # current and enrolled
    # ENROLLMENT_CODE: '615595' # current and not enrolled
  SERVER:
    API_BASE_URL: 'https://tutor-dev.openstax.org'
    COLLECTION_UUID: 'f10533ca-f803-490d-b935-88899941197f'
    MODULE_UUID: '7636a3bf-eb80-4898-8b2c-e81c1711b99f'
    CNX_URL: 'https://dev.cnx.org'

settings = SETTINGS.LOCAL

loadApp = ->
  unless document.readyState is 'interactive'
    return false

  startMathJax()

  mainDiv = document.getElementById('react-root-container')
  buttonA = document.getElementById('launcher')
  buttonB = document.getElementById('launcher-other-course')
  buttonC = document.getElementById('launcher-intro')
  buttonMATHS = document.getElementById('launcher-maths')

  code = window.location.search.replace('?enrollment_code=', '') or settings.ENROLLMENT_CODE
  enrollmentCode = decodeURI(code) if code
  demoSettings =
    collectionUUID: settings.COLLECTION_UUID
    moduleUUID: settings.MODULE_UUID
    cnxUrl: settings.CNX_URL
    enrollmentCode: enrollmentCode
    processHtmlAndMath: typesetMath # from demo
    getNextPage: ->
      nextChapter: '2.2'
      nextTitle: 'Sample module 3'
      nextModuleUUID: 'the-next-page-uuid'
    filterClick: (clickEvent) ->
      console.info('external click or focus')
      return false

  initialModel = _.clone(demoSettings)
  initialModel.mounter = mainDiv
  conceptCoachDemo = new ConceptCoachAPI(settings.API_BASE_URL)

  conceptCoachDemo.setOptions(initialModel)

  conceptCoachDemo.on 'open', conceptCoachDemo.handleOpened
  conceptCoachDemo.on 'ui.close', conceptCoachDemo.handleClosed

  show = (args) ->
    conceptCoachDemo.open(demoSettings, args)
    true

  showOtherCourse = ->
    otherCourseSettings =
      collectionUUID: 'FAKE_COLLECTION'
      moduleUUID: 'FAKE_MODULE'
      cnxUrl: settings.CNX_URL

    conceptCoachDemo.open(otherCourseSettings)
    true

  showIntro = ->
    introSettings = _.extend({}, demoSettings, moduleUUID: 'e98bdaec-4060-4b43-ac70-681555a30e22')

    conceptCoachDemo.open(introSettings)
    true

  showMaths = ->
    introSettings = _.extend({}, demoSettings,
      moduleUUID: '4bba6a1c-a0e6-45c0-988c-0d5c23425670',
      collectionUUID: '27275f49-f212-4506-b3b1-a4d5e3598b99'
    )

    conceptCoachDemo.open(introSettings)
    true

  window.conceptCoachDemo = conceptCoachDemo
  conceptCoachDemo.initialize(buttonA)
  buttonB.addEventListener 'click', showOtherCourse
  buttonC.addEventListener 'click', showIntro
  buttonMATHS.addEventListener 'click', showMaths

  conceptCoachDemo.on 'ui.launching', show

  # Hook in to writing view updates to history api
  conceptCoachDemo.on 'view.update', (eventData) ->
    if eventData.route isnt location.pathname
      history.pushState(eventData.state, null, eventData.route)
    true

  # listen to back/forward and broadcasting to coach navigation
  window.addEventListener 'popstate', (eventData) ->
    conceptCoachDemo.updateToRoute(location.pathname)
    true

  # open to the expected view right away if view in url
  conceptCoachDemo.openByRoute(demoSettings, location.pathname) if location.pathname?

  if AUTOSHOW
    setTimeout( show, 300)
  true

loadApp() or document.addEventListener('readystatechange', loadApp)
