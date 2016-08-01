React = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'Root'

  render: ->
    <div>
      <Router.RouteHandler/>
    </div>
