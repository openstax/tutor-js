React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

PerformanceForecast  = require '../../flux/performance-forecast'
PracticeButton = require './practice-button'
WeakerSections = require './weaker-sections'
{default: PracticeWeakestButton} = require './weakest-practice-button'

WeakerPanel = React.createClass
  propTypes:
    courseId:            React.PropTypes.string.isRequired
    sections:            React.PropTypes.array.isRequired
    weakerTitle:         React.PropTypes.string.isRequired
    weakerExplanation:   React.PropTypes.element.isRequired
    weakerEmptyMessage:  React.PropTypes.string.isRequired
    canPractice:         React.PropTypes.bool
    sectionCount:        React.PropTypes.number
    sampleSizeThreshold: React.PropTypes.number.isRequired

  render: ->
    # Do not render if we have no sections
    return null if @props.sections.length is 0
    # Only show the practice button if practice is allowed and weakest sections exit
    if @props.canPractice and PerformanceForecast.Helpers.canDisplayWeakest(@props) then practiceBtn =
      <PracticeWeakestButton title='Practice All' courseId={this.props.courseId} />

    <div className="chapter-panel weaker">
      <div className='chapter metric'>
        <span className='title'>{@props.weakerTitle}</span>
        {@props.weakerExplanation}
        {practiceBtn}
      </div>
      <WeakerSections {...@props} />

    </div>


module.exports = WeakerPanel
