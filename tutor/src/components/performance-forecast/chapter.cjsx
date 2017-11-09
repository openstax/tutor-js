React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router-dom'

{ChapterSectionMixin} = require 'shared'

ChapterSectionType = require './chapter-section-type'
ProgressBar = require './progress-bar'
Section     = require './section'
Statistics  = require './statistics'


module.exports = React.createClass

  displayName: 'PerformanceForecastChapter'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string
    chapter:  ChapterSectionType.isRequired
    canPractice: React.PropTypes.bool

  render: ->
    {chapter, courseId} = @props

    <div className='chapter-panel'>
      <div className='chapter'>
        <div className='heading'>
          <span className='number'>{chapter.chapter_section[0]}</span>
          <div className='title' title={chapter.title}>{chapter.title}</div>
        </div>
        <ProgressBar {...@props} section={chapter} />
        <Statistics
        courseId={@props.courseId}
        roleId={@props.roleId}
        section={chapter}
        displaying="chapter"/>
      </div>
      <div ref='sections' className='sections'>
        { for section, i in chapter.children
          <Section  key={i} section={section} {...@props} /> }
      </div>
    </div>
