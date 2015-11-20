React = require 'react'
Course = require './model'

ErrorList = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  render: ->
    return null unless @props.course.hasErrors()
    <div className="alert alert-danger">
      <ul className="errors">
        {for msg, i in @props.course.errorMessages()
          <li key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = ErrorList
