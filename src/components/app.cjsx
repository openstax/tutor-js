React = require 'react'
{HistoryLocation, History, RouteHandler} = require 'react-router'

Navbar = require './navbar'

{TransitionActions, TransitionStore} = require '../flux/transition'

module.exports = React.createClass
  displayName: 'App'

  componentDidMount: ->
    @storeInitial()
    HistoryLocation.addChangeListener(@storeHistory)

  componentWillUnmount: ->
    HistoryLocation.removeChangeListener(@storeHistory)

  storeInitial: ->
    if History.length is 1
      path = HistoryLocation.getCurrentPath()
      TransitionActions.load({path})

  storeHistory: (locationChangeEvent) ->
    TransitionActions.load(locationChangeEvent)

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
