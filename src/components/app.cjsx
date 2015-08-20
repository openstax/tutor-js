React = require 'react'
{HistoryLocation, History, RouteHandler} = require 'react-router'
DestinationHelper = require '../helpers/routes-and-destinations'

Navbar = require './navbar'

{TransitionActions, TransitionStore} = require '../flux/transition'

module.exports = React.createClass
  displayName: 'App'
  contextTypes:
    router: React.PropTypes.func

  componentDidMount: ->
    @storeInitial()
    HistoryLocation.addChangeListener(@storeHistory)

  componentWillUnmount: ->
    HistoryLocation.removeChangeListener(@storeHistory)

  storeInitial: ->
    @storeHistory(path: HistoryLocation.getCurrentPath())

  storeHistory: (locationChangeEvent) ->
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
