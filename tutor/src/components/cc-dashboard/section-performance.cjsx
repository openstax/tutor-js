React = require 'react'
BS = require 'react-bootstrap'

SectionPerformance = React.createClass
  displayName: 'SectionPerformace'

  propTypes:
    performance: React.PropTypes.number.isRequired


  render: ->
    {performance} = @props

    percents =
      correct: if performance then Math.round(performance * 100) else 0
    percents.incorrect = 100 - percents.correct
    bars = []

    if percents.correct
      correctLabel = "#{percents.correct}%"
      correctLabel = if percents.correct is 100 then "#{correctLabel} correct" else correctLabel
      bars.push <BS.ProgressBar
        key='correct'
        className="reading-progress-bar progress-bar-correct"
        now={percents.correct}
        label={correctLabel}
        type="correct"
        key={1} />

    if percents.incorrect
      incorrectLabel = if percents.incorrect is 100 then "#{percents.incorrect}% incorrect" else ''
      bars.push <BS.ProgressBar
        key='incorrect'
        className="reading-progress-bar progress-bar-incorrect"
        now={percents.incorrect}
        label={incorrectLabel}
        type="incorrect"
        key={2} />

    <div>
      <BS.ProgressBar className="reading-progress-group">
        {bars}
      </BS.ProgressBar>
    </div>



module.exports = SectionPerformance
