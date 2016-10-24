React = require 'react'
classnames = require 'classnames'
Router = require '../helpers/router'
RoutingHelper = require '../helpers/routing'
Analytics = require '../helpers/analytics'
Navbar = require './navbar'
merge = require 'lodash/merge'
{SpyMode} = require 'shared'
{CourseStore} = require '../flux/course'
{TransitionActions, TransitionStore} = require '../flux/transition'
{ LocationSubscriber } = require 'react-router/Broadcasts'

RouteChange = (props) ->
  TransitionActions.load(props.pathname)
  <span />

module.exports = React.createClass
  displayName: 'App'
  contextTypes:
    router: React.PropTypes.object

#   getChildContext: ->
#     debugger
#     router: merge(@context.router, getCurrentParams: Router.getCurrentParams)
# #    courseId: @props.params?.courseId

  childContextTypes:
    courseId: React.PropTypes.string

  componentDidMount: ->
    @storeHistory()
    Analytics.setTracker(window.ga)

  componentDidUpdate: ->
    @storeHistory()

  storeHistory:  ->
    Analytics.onNavigation(@props.location.pathname)
    TransitionActions.load(@props.location.pathname)

  render: ->
    params = Router.currentParams()
    {courseId} = params

    classNames = classnames('tutor-app', 'openstax-wrapper', {
      'is-college':     courseId? and CourseStore.isCollege(courseId)
      'is-high-school': courseId? and CourseStore.isHighSchool(courseId)
    })

    <div className={classNames}>
      <LocationSubscriber>{RouteChange}</LocationSubscriber>

      <SpyMode.Wrapper>
        <Navbar {...@props}/>
        <RoutingHelper.component routes={Router.getRenderableRoutes()} />
      </SpyMode.Wrapper>
    </div>
