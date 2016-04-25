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
    params: React.PropTypes.object

  componentDidMount: ->
    @storeInitial()
    Analytics.setTracker(window.ga)
    unlisten = @context.router.history.listen(@storeHistory)
    @setState({ unlisten })

  componentWillUnmount: ->
    @state.unlisten?()

  storeInitial: ->
    @storeHistory(unlisten: null, path: @context.router.getCurrentPath())

  storeHistory: (locationChangeEvent) ->
    Analytics.onNavigation(locationChangeEvent, @context.router, @context.params)
    TransitionActions.load(locationChangeEvent, @context.router)

  render: ->
    <div className='tutor-app openstax-wrapper'>
      <SpyMode.Wrapper>
        <Navbar />
        <RouteHandler/>
      </SpyMode.Wrapper>
    </div>
