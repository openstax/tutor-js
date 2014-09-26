# @cjsx React.DOM

React = require 'react'

Dashboard = React.createClass
  render: ->
    <a href="/tasks">Tasks</a>

Tasks = React.createClass
  render: ->
    <a href="/">Home</a>

Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <a href="/">Home</a>
    </div>

module.exports = {Dashboard, Tasks, Invalid}
