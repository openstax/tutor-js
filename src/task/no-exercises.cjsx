React = require 'react'

NoExercises = React.createClass
  displayName: 'NoExercises'
  render: ->
    <div className='no-exercises'>
      Sorry, there are no exercises for this module.
    </div>

module.exports = {NoExercises}
