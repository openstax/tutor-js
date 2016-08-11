React = require 'react'

{CurrentUserStore} = require '../../flux/current-user'

UserName = React.createClass
  displayName: 'UserName'

  render: ->
    <span {...@props}>{CurrentUserStore.getName()}</span>

module.exports = UserName
