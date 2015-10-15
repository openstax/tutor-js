React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{CurrentUserStore} = require '../../flux/current-user'
{TransitionAssistant} = require '../unsaved-state'

module.exports = React.createClass
  displayName: 'Navigation'

  contextTypes:
    router: React.PropTypes.func

  redirectToAccount: ->
    if window.OxAccount
      OxAccount.onAvailable -> OxAccount.displayProfile()
    else
      window.open(CurrentUserStore.getProfileUrl(), 'account-profile')

  render: ->
    return null unless CurrentUserStore.getProfileUrl()
    <BS.MenuItem onSelect={@redirectToAccount} >
      My Account
    </BS.MenuItem>
