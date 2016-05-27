_ = require 'underscore'
React = require 'react'
Exercise = require '../model/exercise'
ChapterSectionMixin = require './chapter-section-mixin'

ExerciseIdentifierLink = React.createClass

  mixins: [ChapterSectionMixin]

  propTypes:
    bookUUID: React.PropTypes.string
    exerciseId: React.PropTypes.string.isRequired
    project: React.PropTypes.oneOf(['concept-coach', 'tutor'])
    related_content: React.PropTypes.array.isRequired

  buildLabel: (related) ->
    chapterSection = @sectionFormat(related.chapter_section, @props.sectionSeparator)
    "Comes from #{chapterSection} - #{related.title}"

  render: ->
    url = Exercise.troubleUrl(@props)
    <div>
      <span className='exercise-identifier-link'>
        ID# {@props.exerciseId} | <a target="_blank" href={url}>Report an error</a>
      </span>
      <p>
        { _.map(@props.related_content, @buildLabel) }
      </p>
    </div>
module.exports = ExerciseIdentifierLink
