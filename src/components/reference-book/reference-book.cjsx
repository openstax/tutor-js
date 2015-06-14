React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

NavBar = require './navbar'

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [ Router.State ]

  render: ->
    {courseId} = @getParams()
    <div className="reference-book">
      <NavBar courseId={courseId}/>
      <Router.RouteHandler courseId={courseId} />
    </div>
