React = require 'react'
{RouteHandler} = require 'react-router'

AdminDashboard = React.createClass
  render: ->
    <div>
      <h1>Hello Admin!</h1>
      <RouteHandler/>
    </div>


module.exports = AdminDashboard
