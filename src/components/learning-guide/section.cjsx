React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
ChapterSectionMixin = require '../chapter-section-mixin'
ProgressBar = require './progress-bar'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass

  displayName: 'LearningGuideSection'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    section:  ChapterSectionType.isRequired
    onPractice: React.PropTypes.func

  mixins: [ChapterSectionMixin]

  render: ->
    {courseId, section} = @props

    <div className='section'>
      <div className='section-heading'>
        <span className='section-number'>
          {@sectionFormat(section.chapter_section)}
        </span>
        <span className='section-title' title={section.title}>{section.title}</span>
      </div>

      <ProgressBar {...@props} />

      <div className='amount-worked'>
        <span className='count'>{section.questions_answered_count} worked</span>
      </div>
    </div>
