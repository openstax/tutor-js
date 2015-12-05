React = require 'react'
BS = require 'react-bootstrap'

SectionProgress = React.createClass
  _getPercentage: (num, total) ->
    Math.round((num / total) * 100)

  render: ->
    total = @props.section.completed + @props.section.in_progress + @props.section.not_started

    percents =
      completed: @_getPercentage(@props.section.completed, total)
    completedLabel = "#{percents.completed}%"
    completedLabel = if percents.completed is 100 then "#{completedLabel} completed" else completedLabel

    incompleteClass = ""

    progressClass = classnames 'reading-progress-group',
      'none-completed': percents.completed is 0

    if percents.completed > 0
      completed = <BS.ProgressBar
        className="reading-progress-bar"
        bsStyle="info"
        label={completedLabel}
        now={percents.completed}
        type="completed"
        key={1} />
    else
      noneCompleteLabel = "0% complete"

    <div>
      <BS.ProgressBar className={progressClass} label={noneCompleteLabel}>
        {completed}
      </BS.ProgressBar>
    </div>

module.exports = SectionProgress
