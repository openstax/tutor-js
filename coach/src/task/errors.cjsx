React = require 'react'

NoExercises = React.createClass
  displayName: 'NoExercises'
  render: ->
    <div className='no-exercises'>
      Sorry, there are no exercises for this module.
    </div>

CourseEnded = React.createClass
  displayName: 'CourseEnded'
  render: ->
    <div className='course-ended'>
      This Concept Coach course has ended. Click My Progress
      at the top of the screen to access all previous work for this course.
    </div>


module.exports =
  no_exercises: NoExercises
  course_ended: CourseEnded
