React = require 'react'
BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'

UserName = React.createClass
  displayName: 'UserName'

  mixins: [BindStoreMixin]

  bindStore: CurrentUserStore

  bindUpdate: ->
    @setState(name: CurrentUserStore.getName())

  getInitialState: ->
    name: CurrentUserStore.getName()

  componentWillMount: ->
    unless @state.name
      @_addListener()
      CurrentUserActions.load()

  render: ->
    <span {...@props}>{@state.name}</span>

module.exports = UserName
