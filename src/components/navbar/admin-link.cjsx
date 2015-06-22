BS = require 'react-bootstrap'
React = require 'react'
BindStoreMixin = require '../bind-store-mixin'

{CurrentUserStore} = require '../../flux/current-user'

module.exports = React.createClass
  displayName: 'AdminLink'

  mixins: [BindStoreMixin]
  bindStore: CurrentUserStore

  render: ->
    if CurrentUserStore.isAdmin()
      <BS.Button href='/admin' bsStyle='danger' bsSize='small'>Admin</BS.Button>
    else
      <span />
