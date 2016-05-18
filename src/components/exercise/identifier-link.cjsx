React = require 'react'

ExerciseTroubleUrl = require '../../model/exercise-trouble-url'


ExerciseIdentifierLink = React.createClass

  propTypes:
    bookUUID: React.PropTypes.string
    exerciseId: React.PropTypes.string.isRequired
    project: React.PropTypes.oneOf(['concept-coach', 'tutor'])

  render: ->
    url = ExerciseTroubleUrl.generate(@props)
    <span className='exercise-identifier-link'>
      ID# {@props.exerciseId} | <a target="_blank" href={url}>Report an error</a>
    </span>

module.exports = ExerciseIdentifierLink
