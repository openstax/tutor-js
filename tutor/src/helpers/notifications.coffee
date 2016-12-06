{NotificationActions} = require 'shared'

Router = require './router'

module.exports =

  start: (bootstrapData) ->
    NotificationActions.startPolling()
    for level, message of (bootstrapData.flash or {})
      NotificationActions.display({message, level})

  buildCallbackHandlers: (comp) ->
    router = comp.context.router
    unless router
      throw new Error("Component's context must have router present")
    missing_student_id:
      onAdd: ({course}) ->
        router.transitionTo(
          Router.makePathname('changeStudentId', courseId: course.id)
        )
