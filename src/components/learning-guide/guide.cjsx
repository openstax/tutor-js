React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
WeakerPanel = require './weaker-panel'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:    React.PropTypes.string.isRequired
    allSections: React.PropTypes.array.isRequired
    chapters:    React.PropTypes.arrayOf(ChapterSectionType)
    heading:     React.PropTypes.element
    onPractice:  React.PropTypes.func
    onReturn:    React.PropTypes.func.isRequired
    weakerTitle: React.PropTypes.string.isRequired
    weakerExplanation: React.PropTypes.element
    sampleSizeThreshold: React.PropTypes.number.isRequired

  render: ->
    {courseId} = @props

    noData = @props.allSections.length is 0

    <div className='guide-container'>

      {@props.heading}

      {@props.emptyMessage if noData}

      <div className='guide-group'>


        <WeakerPanel sections={@props.allSections} {...@props} />

        <BS.Row>
          <h3>Individual Chapters</h3>
        </BS.Row>

        {for chapter, i in (@props.chapters or [])
          <Chapter key={i} chapter={chapter} {...@props} />}

      </div>


      <div className='guide-footer'>


      </div>

    </div>
