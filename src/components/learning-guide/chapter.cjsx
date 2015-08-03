React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

ChapterSectionMixin = require '../chapter-section-mixin'

ChapterSectionType = require './chapter-section-type'
ProgressBar = require './progress-bar'
Section = require './section'

module.exports = React.createClass

  displayName: 'LearningGuideChapter'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    chapter:  ChapterSectionType.isRequired
    onPractice: React.PropTypes.func

  render: ->
    {chapter, courseId} = @props

    <div className='chapter-panel'>
      <div className='chapter-heading'>
        <span className='chapter-number'>{chapter.chapter_section[0]}</span>
        <div className='chapter-title' title={chapter.title}>{chapter.title}</div>
        <ProgressBar {...@props} section={chapter} />
        <div className='amount-worked'>
          <span className='count chapter'>
            {chapter.questions_answered_count} problems worked in this chapter
          </span>
        </div>
      </div>
      <div ref='sections' className='sections'>
        { for section, i in chapter.children
          <Section  key={i} section={section} {...@props} /> }
      </div>
    </div>
