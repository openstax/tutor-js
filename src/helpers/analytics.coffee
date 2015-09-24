_ = require 'underscore'
Router = require 'react-router'
{HistoryLocation} = require 'react-router'

Analytics =

  onNavigation: (router) ->
    # Tell GA that all events after this should be credited to this path
    ga('set', 'page', router.getCurrentPath())

    route = _.last router.getCurrentRoutes()
    @handlers[route.name]?( router.getCurrentParams() )

    ga('send', 'pageview')


  sendEvent: (attrs) ->
    ga('send', 'event', attrs.category, attrs.action, attrs.label, attrs.value)

  handlers:
    viewTaskStep: ({courseId, id}) ->
      Analytics.sendEvent( category: 'Task', action: 'Step' )

    viewGuide: ->
      Analytics.sendEvent( category: 'LearningGuide' )

    viewStudentDashboard: ->
      Analytics.sendEvent( category: 'Dashboard' )


module.exports = Analytics
