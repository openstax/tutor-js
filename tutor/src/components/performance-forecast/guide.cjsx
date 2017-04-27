React = require 'react'
BS = require 'react-bootstrap'

_ = require 'underscore'
classnames = require 'classnames'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
WeakerPanel = require './weaker-panel'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'PerformanceForecast'

  propTypes:
    courseId:    React.PropTypes.string.isRequired
    roleId:   React.PropTypes.string
    allSections: React.PropTypes.array.isRequired
    chapters:    React.PropTypes.arrayOf(ChapterSectionType)
    heading:     React.PropTypes.element
    canPractice:  React.PropTypes.bool
    weakerTitle: React.PropTypes.string.isRequired
    weakerExplanation: React.PropTypes.element

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
    className = classnames 'guide-container',
      'is-loading': @props.isLoading?()
      'is-empty'  : _.isEmpty(@props.allSections)

    if @props.isLoading?()
      body = @props.loadingMessage
    else if _.isEmpty(@props.allSections)
      body = @props.emptyMessage
    else
      body = @renderBody()

    <div className={className}>
      {@props.heading}
      {body}
    </div>
