React = require 'react'

{HistoryLocation, History, RouteHandler} = require 'react-router'

Navbar = require './navbar'
Analytics = require '../helpers/analytics'
{SpyMode} = require 'openstax-react-components'

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
    <div className='tutor-app'>
      <SpyMode.Wrapper>
        <Navbar />
        <RouteHandler/>
      </SpyMode.Wrapper>
    </div>
