TutorRouter = require '../../helpers/router'

_ = require 'lodash'

module.exports =

  shouldIntro: ->
    TutorRouter.currentQuery()?.showIntro is 'true'

  scheduleIntroEvent: (cbFn, args...) ->
    if @shouldIntro()
      _.delay(_.partial(cbFn, args...), 1500)
    else
      undefined

  clearScheduledEvent: (event) ->
    clearTimeout(event) if (event)
