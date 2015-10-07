React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

ChapterSectionMixin = require '../chapter-section-mixin'

ChapterSectionType = require './chapter-section-type'
ProgressBar = require './progress-bar'
Section     = require './section'
Statistics  = require './statistics'


module.exports = React.createClass

  displayName: 'PerformanceForecastChapter'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    chapter:  ChapterSectionType.isRequired
    onPractice: React.PropTypes.func
    sampleSizeThreshold: React.PropTypes.number.isRequired

  render: ->
    {chapter, courseId} = @props

    <div className='chapter-panel'>
      <div className='chapter'>
        <div className='heading'>
          <span className='number'>{chapter.chapter_section[0]}</span>
          <div className='title' title={chapter.title}>{chapter.title}</div>
        </div>
        <ProgressBar {...@props} section={chapter} />
        <Statistics courseId={@props.courseId} section={chapter} displaying="chapter"/>
      </div>
      <div ref='sections' className='sections'>
        { for section, i in chapter.children
          <Section  key={i} section={section} {...@props} /> }
      </div>
    </div>
