React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PerformanceForecast = require '../../flux/performance-forecast'

ButtonWithTip = require '../buttons/button-with-tip'
Practice = require './practice'

module.exports = React.createClass
  displayName: 'PerformanceForecastProgressBar'

  propTypes:
    section:  React.PropTypes.object.isRequired
    canPractice: React.PropTypes.bool
    courseId:    React.PropTypes.string.isRequired
    ariaLabel:   React.PropTypes.string

  getDefaultProps: ->
    id: _.uniqueId('progress-bar-tooltip-')
    canPractice: false
    ariaLabel:   ''

  render: ->
    {section, canPractice, courseId, id, ariaLabel} = @props
    {page_ids} = section

    bar = if PerformanceForecast.Helpers.canDisplayForecast(section.clue)
      percent = Math.round(Number(section.clue.most_likely) * 100)
      value_interpretation = if percent >= 80 then 'high' else (if percent >= 30 then 'medium' else 'low')
      # always show at least 5% of bar, otherwise it just looks empty
      <BS.ProgressBar
        aria-label={"Practice - #{ariaLabel}"}
        className={value_interpretation}
        now={Math.max(percent, 5)}
      />
    else
      msg = if canPractice then 'Practice more to get forecast' else 'Not enough exercises completed'
      <div className="no-data" aria-label={"#{msg} - #{ariaLabel}"}>
        {msg}
      </div>

    if canPractice
      <Practice
        courseId={courseId}
        page_ids={page_ids}>
        <BS.Button id={id} block role='link'>
          {bar}
        </BS.Button>
      </Practice>
    else
      bar
