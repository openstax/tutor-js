React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

SectionProgress = React.createClass

  render: ->
    p = @props.section.completed_percentage

    percent = switch
      when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
      when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
      when (p > 1) then 100             # Don't let it go over 100%!
      else Math.round(p * 100)

    completedLabel = "#{percent}%"
    completedLabel = if percent is 100 then "#{completedLabel} completed" else completedLabel

    incompleteClass = ""

    progressClass = classnames 'reading-progress-group',
      'none-completed': percent is 0

    if percent > 0
      completed = <BS.ProgressBar
        className="reading-progress-bar"
        bsStyle="info"
        label={completedLabel}
        now={percent}
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
