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
      TransitionActions.load(path)

  storeHistory: (locationChangeEvent) ->
    {path, type} = locationChangeEvent
    TransitionActions.load(path) if type is 'push'

  render: ->
    <div>
      <Navbar/>
      <RouteHandler/>
    </div>
