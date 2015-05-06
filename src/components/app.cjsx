React = require 'react'
Router = require 'react-router'

Navbar = require './navbar'

module.exports = React.createClass
  displayName: 'App'

  render: ->
    <div>
      <Navbar/>
      <Router.RouteHandler/>
    </div>
