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
  displayName: 'PerformanceForecast'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:    React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string.isRequired
    allSections: React.PropTypes.array.isRequired
    chapters:    React.PropTypes.arrayOf(ChapterSectionType)
    heading:     React.PropTypes.element
    onPractice:  React.PropTypes.func
    onReturn:    React.PropTypes.func.isRequired
    weakerTitle: React.PropTypes.string.isRequired
    weakerExplanation: React.PropTypes.element
    sampleSizeThreshold: React.PropTypes.number.isRequired

  renderBody: ->
    <div className='guide-group'>
      <WeakerPanel sections={@props.allSections} {...@props} />
      <BS.Row>
        <h3>Individual Chapters</h3>
      </BS.Row>
      {for chapter, i in (@props.chapters or [])
        <Chapter key={i} chapter={chapter} {...@props} />}
    </div>

  render: ->
    className = 'guide-container'

    if @props.isLoading?()
      body = @props.loadingMessage
    else if _.isEmpty(@props.allSections)
      body = @props.emptyMessage
    else
      body = @renderBody()

    <div className='guide-container'>
      {@props.heading}
      {body}
    </div>
