React = require 'react'

Exercise = require '../model/exercise'
ChapterSectionMixin = require './chapter-section-mixin'

ExerciseIdentifierLink = React.createClass

  mixins: [ChapterSectionMixin]

  propTypes:
    bookUUID: React.PropTypes.string
    exerciseId: React.PropTypes.string.isRequired
    project: React.PropTypes.oneOf(['concept-coach', 'tutor'])

  contextTypes:
    oxProject: React.PropTypes.string
    bookUUID:  React.PropTypes.string

  render: ->
    url = Exercise.troubleUrl({
      exerciseId: @props.exerciseId
      project:    @props.project  or @context.oxProject
      bookUUID:   @props.bookUUID or @context.bookUUID
    })

    <div>
      <span className='exercise-identifier-link'>
        ID# {@props.exerciseId} | <a
          target="_blank" tabIndex={-1} href={url}
        >Report an error</a>
      </span>
    </div>
module.exports = ExerciseIdentifierLink
