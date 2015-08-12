React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

LearningGuide  = require '../../flux/learning-guide'
PracticeButton = require './practice-button'
WeakerSections = require './weaker-sections'

WeakerPanel = React.createClass
  propTypes:
    courseId:            React.PropTypes.string.isRequired
    sections:            React.PropTypes.array.isRequired
    weakerTitle:         React.PropTypes.string.isRequired
    weakerExplanation:   React.PropTypes.element.isRequired
    weakerEmptyMessage:  React.PropTypes.string.isRequired
    onPractice:          React.PropTypes.func
    sectionCount:        React.PropTypes.number
    minimumSectionCount: React.PropTypes.number

  renderLackingData: ->
    <div className='lacking-data'>{@props.weakerEmptyMessage}</div>

  renderSections: (validSections, displayCount) ->
    # Sort by value and pick 'displayCount' of the weakest
    weakestSections = _.chain(validSections)
      .sortBy((s) -> s.clue.value )
      .first(displayCount)
      .value()

    for section, i in weakestSections
      <Section key={i} section={section} {...@props} />

  render: ->
    # Do not render if we have no sections
    return null if @props.sections.length is 0

    <div className="chapter-panel weaker">
      <div className='chapter metric'>
        <span className='title'>{@props.weakerTitle}</span>
        {@props.weakerExplanation}
        {if @props.onPractice and LearningGuide.Helpers.canPractice(@props)
          <PracticeButton title='Practice All'
            sections=LearningGuide.Helpers.weakestSections(@props.sections)
            courseId={@props.courseId} /> }
      </div>
      <WeakerSections {...@props} />

    </div>


module.exports = WeakerPanel
