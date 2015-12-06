React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

SectionProgress = React.createClass

  render: ->
    percent = Math.round(@props.section.completed_percentage * 100)
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
