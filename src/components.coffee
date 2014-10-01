# @cjsx React.DOM
React = require 'react'

ModelMixin =
  componentDidMount: ->
    # Whenever there may be a change in the Backbone data, trigger a reconcile.
    @__forceUpdate = @forceUpdate.bind(@, null)
    @props.model.on('loading add change remove', @__forceUpdate)

  componentWillUnmount: ->
    # Ensure that we clean up any dangling references when the component is
    # destroyed.
    @props.model.off('loading add change remove', @__forceUpdate)

  renderLoading: -> <div>Loading...</div>
  renderRejected: -> <div>Loading Error for {@props.model.url()}</div>
  # renderResolved: -> <div>Loaded</div>

  render: ->
    switch @props.model.promiseState()
      when 'UNLOADED' then @renderLoading()
      when 'LOADING'  then @renderLoading()
      when 'RESOLVED' then @renderResolved()
      when 'REJECTED' then @renderRejected()
      else throw new Error('BUG: unknown PromiseState')


Dashboard = React.createClass
  render: ->
    <a href="/tasks">Tasks</a>

Tasks = React.createClass
  mixins: [ModelMixin]
  renderResolved: ->
    <div>
      <a href="/dashboard">Home</a>
      <br/>{@props.model.length} tasks
    </div>

Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <a href="/dashboard">Home</a>
    </div>

module.exports = {Dashboard, Tasks, Invalid}
