React = require 'react'
classnames = require 'classnames'
Joyride = require('react-joyride').default


RoutingHelper = require '../helpers/routing'
Analytics = require '../helpers/analytics'
Navbar = require './navbar'
{SpyMode} = require 'shared'
{CourseStore} = require '../flux/course'
{TransitionActions, TransitionStore} = require '../flux/transition'

STEPS = [
  {
    title: 'Progress Guide'
    text: 'The progress guide displays how well Tutor thinks you are understanding the underlying concepts',
    selector: '.student-dashboard .progress-guide',
    position: 'top'
  }, {
    title: 'Reference Book'
    text: 'This will display an electronic version of the course texbook'
    selector: '.student-dashboard .view-reference-guide',
    position: 'top'
  }
]

module.exports = React.createClass
  displayName: 'App'
  contextTypes:
    router: React.PropTypes.object

  getChildContext: ->
    courseId: @props.params?.courseId

  childContextTypes:
    courseId: React.PropTypes.string

  componentDidMount: ->
    @storeHistory()
    Analytics.setTracker(window.ga)

  componentDidUpdate: ->
    @refs.joyride.start()
    @storeHistory()

  storeHistory:  ->
    Analytics.onNavigation(@props.location.pathname)
    TransitionActions.load(@props.location.pathname)

  render: ->
    {courseId} = @props.params or {}
    classNames = classnames('tutor-app', 'openstax-wrapper', {
      'is-college':     courseId? and CourseStore.isCollege(courseId)
      'is-high-school': courseId? and CourseStore.isHighSchool(courseId)
    })
    <div className={classNames}>
      <Joyride ref="joyride" debug={true} steps={STEPS} showStepsProgress={true} />
      <SpyMode.Wrapper>
        <Navbar {...@props} />
        {RoutingHelper.subroutes(@props.routes)}
      </SpyMode.Wrapper>
    </div>
