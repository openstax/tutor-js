React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
ChapterSectionMixin = require '../chapter-section-mixin'
ChapterSectionType  = require './chapter-section-type'
ProgressBar = require './progress-bar'
Statistics  = require './statistics'


module.exports = React.createClass

  displayName: 'PerformanceForecastSection'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired
    section:  ChapterSectionType.isRequired
    onPractice: React.PropTypes.func
    sampleSizeThreshold: React.PropTypes.number.isRequired

  mixins: [ChapterSectionMixin]

  render: ->
    {courseId, section} = @props

    <div className='section'>
      <div className='heading'>
        <span className='number'>
          {@sectionFormat(section.chapter_section)}
        </span>
        <span className='title' title={section.title}>{section.title}</span>
      </div>

      <ProgressBar {...@props} />
      <Statistics
      courseId={@props.courseId}
      roleId={@props.roleId}
      section={section}
      displaying="section" />

    </div>
