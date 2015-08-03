React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{TransitionAssistant} = require '../unsaved-state'

module.exports = React.createClass
  displayName: 'Navigation'

  contextTypes:
    router: React.PropTypes.func

  redirectToAccount: ->
    TransitionAssistant.checkTransitionState().then( ->
      console.log "Going places"
    , ->
      console.log "Stoppped from going places"
    )

  render: ->
    <BS.MenuItem onSelect={@redirectToAccount} >
      My Account
    </BS.MenuItem>
