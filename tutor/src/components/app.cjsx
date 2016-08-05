React = require 'react'
classnames = require 'classnames'

{HistoryLocation, History, RouteHandler} = require 'react-router'

Navbar = require './navbar'
Analytics = require '../helpers/analytics'
{SpyMode} = require 'shared'
{CourseStore} = require '../flux/course'
{TransitionActions, TransitionStore} = require '../flux/transition'

module.exports = React.createClass
  displayName: 'App'
  contextTypes:
    router: React.PropTypes.func

  componentDidMount: ->
    @storeInitial()
    Analytics.setTracker(window.ga)
    HistoryLocation.addChangeListener(@storeHistory)

  componentWillUnmount: ->
    HistoryLocation.removeChangeListener(@storeHistory)

  storeInitial: ->
    @storeHistory(path: @context.router.getCurrentPath())

  storeHistory: (locationChangeEvent) ->
    Analytics.onNavigation(locationChangeEvent, @context.router)
    TransitionActions.load(locationChangeEvent, @context.router)

  render: ->
    {courseId} = @context.router.getCurrentParams()
    classNames = classnames('tutor-app', 'openstax-wrapper', {
      'is-college':     courseId? and CourseStore.isCollege(courseId)
      'is-high-school': courseId? and CourseStore.isHighSchool(courseId)
    })
    <div className={classNames}>
      <SpyMode.Wrapper>
        <Navbar />
        <RouteHandler/>
      </SpyMode.Wrapper>
    </div>
