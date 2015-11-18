React = require 'react'
Course = require './model'
ENTER = 'Enter'

ModifyCourseRegistration = React.createClass
  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    onComplete: React.PropTypes.func.isRequired

  render: ->
    course = @getUser().getCourse(@props.collectionUUID)

    <div className="row">
      <h3>Modify {course.description()}</h3>
    </div>

module.exports = ModifyCourseRegistration
