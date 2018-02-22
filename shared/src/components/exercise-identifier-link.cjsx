React = require 'react'

first = require 'lodash/first'
pick = require 'lodash/pick'
extend = require 'lodash/extend'

Exercise = require '../model/exercise'
ChapterSectionMixin = require './chapter-section-mixin'

ExerciseIdentifierLink = React.createClass

  mixins: [ChapterSectionMixin]

  propTypes:
    bookUUID: React.PropTypes.string
    exerciseId: React.PropTypes.string.isRequired
    project: React.PropTypes.oneOf(['concept-coach', 'tutor'])
    related_content: React.PropTypes.arrayOf(React.PropTypes.shape(
      chapter_section: React.PropTypes.arrayOf(React.PropTypes.number)
      title: React.PropTypes.string
    ))
    chapter_section: React.PropTypes.arrayOf(React.PropTypes.number)
    title: React.PropTypes.string

  contextTypes:
    oxProject: React.PropTypes.string
    bookUUID:  React.PropTypes.string

  getLocationInfo: ->
    info = if @props.related_content
      first(@props.related_content)
    else
      @props

    pick(info, 'chapter_section', 'title')

  render: ->
    url = Exercise.troubleUrl(extend(@getLocationInfo(), {
      exerciseId: @props.exerciseId
      project:    @props.project  or @context.oxProject
      bookUUID:   @props.bookUUID or @context.bookUUID
    }))

    <div>
      <span className='exercise-identifier-link'>
        ID# {@props.exerciseId} | <a
          target="_blank" tabIndex={-1} href={url}
        >Report an error</a>
      </span>
    </div>
module.exports = ExerciseIdentifierLink
