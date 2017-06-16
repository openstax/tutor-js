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

  getDefaultProps: ->
    id: _.uniqueId('progress-bar-tooltip-')
    canPractice: false

  getTip: (props) ->
    'Click to practice' unless props.isDisabled

  render: ->
    {section, canPractice, courseId, id} = @props
    {page_ids} = section

    bar = if PerformanceForecast.Helpers.canDisplayForecast(section.clue)
      percent = Math.round(Number(section.clue.most_likely) * 100)
      value_interpretation = if percent >= 80 then 'high' else (if percent >= 30 then 'medium' else 'low')
      # always show at least 5% of bar, otherwise it just looks empty
      <BS.ProgressBar className={value_interpretation} now={Math.max(percent, 5)} />
    else
      <div className="no-data">
        {if canPractice then 'Practice more to get forecast' else 'Not enough exercises completed'}
      </div>

    if canPractice
      <Practice
        courseId={courseId}
        page_ids={page_ids}>
        <ButtonWithTip id={id} block getTip={@getTip}>
          {bar}
        </ButtonWithTip>
      </Practice>
    else
      bar
