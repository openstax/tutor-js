{NotificationActions} = require 'shared'

module.exports =

  start: (bootstrapData) ->
    NotificationActions.startPolling()
    for level, message of (bootstrapData.flash or {})
      NotificationActions.display({message, level})

  buildCallbackHandlers: (comp) ->
    # Require router here because requiring it in global scope
    # causes hot module reloading to fail in dev mode because this file is required outside the HMR scope
    Router = require './router'
    router = comp.context.router
    unless router
      throw new Error("Component's context must have router present")
    missing_student_id:
      onAdd: ({course}) ->
        router.transitionTo(
          Router.makePathname('changeStudentId', courseId: course.id)
        )
