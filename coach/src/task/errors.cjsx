React = require 'react'

NoExercises = React.createClass
  displayName: 'NoExercises'
  render: ->
    <div className='no-exercises'>
      Sorry, there are no exercises for this module.
    </div>

CourseEnded = React.createClass
  displayName: 'NoExercises'
  render: ->
    <div className='no-exercises'>
      Sorry, there are no exercises for this module.
    </div>


module.exports =
  no_exercises: NoExercises
  course_ended: CourseEnded
