React = require 'react'
BS = require 'react-bootstrap'

PerformanceBar = React.createClass
  render: ->
    percents =
      correct: if @props.performance then Math.round(@props.performance * 100) else 0

    percents.incorrect = 100 - percents.correct

    if percents.correct
      correctLabel = if percents.incorrect > percents.correct then "#{percents.correct}%"
      correctLabel = if percents.correct is 100 then "#{correctLabel} correct" else correctLabel
      correctBar = <BS.ProgressBar
        className="reading-progress-bar progress-bar-correct"
        now={percents.correct}
        label={correctLabel}
        type="correct"
        key={1} />

    if percents.incorrect
      incorrectLabel = if percents.incorrect > percents.correct then "#{percents.incorrect}%"
      incorrectLabel = if percents.incorrect is 100 then "#{incorrectLabel} incorrect" else incorrectLabel
      incorrectBar = <BS.ProgressBar
        className="reading-progress-bar progress-bar-incorrect"
        now={percents.incorrect}
        label={incorrectLabel}
        type="incorrect"
        key={2} />

    <div>
      <BS.ProgressBar className="reading-progress-group">
        {correctBar}
        {incorrectBar}
      </BS.ProgressBar>
    </div>

module.exports = PerformanceBar
