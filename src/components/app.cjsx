React = require 'react'
Router = require 'react-router'

Nav = require './nav'

module.exports = React.createClass
  displayName: 'App'

  render: ->
    <div>
      <Nav/>
      <Router.RouteHandler/>
    </div>
