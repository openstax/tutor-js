React = require 'react'
BS = require 'react-bootstrap'

{CurrentUserStore} = require '../../flux/current-user'

module.exports = React.createClass
  displayName: 'Navigation'

  render: ->
    return null unless CurrentUserStore.getProfileUrl()
    <li>
      <a href={CurrentUserStore.getProfileUrl()} target='_blank' onClick={if @props.onClick then @props.onClick}>My Account</a>
    </li>
