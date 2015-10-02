React = require 'react'

{HistoryLocation, History, RouteHandler} = require 'react-router'

Navbar = require './navbar'
Analytics = require '../helpers/analytics'
SpyModeWrapper = require './spy-mode/wrapper'

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
      <SpyModeWrapper>
        <Navbar />
        <RouteHandler/>
      </SpyModeWrapper>
    </div>
