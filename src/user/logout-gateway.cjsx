React = require 'react'

User  = require './model'

SECOND = 1000

LogoutGateway = React.createClass

  getInitialState: ->
    seconds: 10

  componentWillMount: ->
    _.delay @tick, SECOND

  tick: ->
    return unless @isMounted()
    if @state.seconds < 1
      window.location.href = User.endpoints.login
    else
      @setState(seconds: @state.seconds - 1)
      _.delay @tick, SECOND

  render: ->
    <div className='logout'>
      <h3>You need to login in order to use ConceptCoach™</h3>
      <p>
        Please <a href={User.endpoints.login}>click to continue</a>,
        or you will be redirected in {@state.seconds} seconds.
      </p>
    </div>

module.exports = LogoutGateway
