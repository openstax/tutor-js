React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

PracticeButton = require './practice-button'
PerformanceForecast = require '../../flux/performance-forecast'
Section = require './section'

WeakerSections = React.createClass

  propTypes:
    courseId:     React.PropTypes.string.isRequired
    sections:     React.PropTypes.array.isRequired
    weakerEmptyMessage:  React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  renderLackingData: ->
    <div className='lacking-data'>{@props.weakerEmptyMessage}</div>

  renderSections: ->
    for section, i in PerformanceForecast.Helpers.weakestSections(@props.sections, @props.sampleSizeThreshold)
      <Section key={i} section={section} {...@props} />

  render: ->
    <div className='sections'>
      {if PerformanceForecast.Helpers.canDisplayWeakest(@props) then @renderSections() else @renderLackingData()}
    </div>



module.exports = WeakerSections
