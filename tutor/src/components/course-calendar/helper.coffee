TutorRouter = require '../../helpers/router'
{UiSettings} = require 'shared'

_ = require 'lodash'

SIDEBAR_KEY_PREFIX = "CSB"

module.exports =

  shouldIntro: ->
    TutorRouter.currentQuery().showIntro is 'true'

  scheduleIntroEvent: (cbFn, args...) ->
    if @shouldIntro()
      _.delay(_.partial(cbFn, args...), 1000)
    else
      undefined

  clearScheduledEvent: (event) ->
    clearTimeout(event) if (event)

  isSidebarOpen: (courseId) ->
    !!UiSettings.get(SIDEBAR_KEY_PREFIX, courseId)

  setSidebarOpen: (courseId, isOpen) ->
    UiSettings.set(SIDEBAR_KEY_PREFIX, courseId, isOpen)
