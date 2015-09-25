React = require 'react'
{HistoryLocation, History, RouteHandler} = require 'react-router'

Navbar = require './navbar'
Analytics = require '../helpers/analytics'

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

  getInitialState: ->
    displayDebug: false

  toggleDebug: (ev) ->
    @setState(displayDebug: not @state.displayDebug)
    ev.preventDefault()

  render: ->
    classes = ['tutor-app']
    classes.push 'display-debug-content' if @state.displayDebug
    <div className={classes.join(' ')}>
      <a href='#' onClick={@toggleDebug} className='debug-toggle-link'>&pi;</a>
      <Navbar />
      <RouteHandler/>
    </div>
