React = require 'react'

Exercise = require '../model/exercise'


ExerciseIdentifierLink = React.createClass

  propTypes:
    bookUUID: React.PropTypes.string
    exerciseId: React.PropTypes.string.isRequired
    project: React.PropTypes.oneOf(['concept-coach', 'tutor'])

  render: ->
    url = Exercise.troubleUrl(@props)
    <span className='exercise-identifier-link'>
      ID# {@props.exerciseId} | <a target="_blank" href={url}>Report an error</a>
    </span>

module.exports = ExerciseIdentifierLink
