React = require 'react'
BS = require 'react-bootstrap'

ChapterSectionType = require './chapter-section-type'
PerformanceForecast = require '../../flux/performance-forecast'

module.exports = React.createClass
  displayName: 'PerformanceForecastProgressBar'

  propTypes:
    section:  React.PropTypes.object.isRequired
    onPractice: React.PropTypes.func
    courseId:    React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  render: ->
    {section, onPractice} = @props

    bar = if PerformanceForecast.Helpers.canDisplayForecast(section.clue, @props.sampleSizeThreshold)
      percent = Math.round((section.clue.value / 1) * 100)
      # always show at least 5% of bar, otherwise it just looks empty
      <BS.ProgressBar className={section.clue.value_interpretation} now={Math.max(percent, 5)} />
    else
      <span className="no-data">
        {if onPractice then 'Practice more to get forecast' else 'Not enough exercises completed'}
      </span>

    if onPractice
      tooltip = <BS.Tooltip>Click to practice</BS.Tooltip>
      <BS.OverlayTrigger placement='bottom' overlay={tooltip}>
        <BS.Button onClick={-> onPractice(section)} block>{bar}</BS.Button>
      </BS.OverlayTrigger>
    else
      bar
