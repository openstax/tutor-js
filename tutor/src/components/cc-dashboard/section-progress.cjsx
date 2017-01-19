React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

SectionProgress = React.createClass
  displayName: 'SectionProgress'

  propTypes:
    section: React.PropTypes.shape(
      completed_percentage: React.PropTypes.number.isRequired
    ).isRequired

  render: ->
    p = @props.section.completed_percentage

    percent = switch
      when (p < 1 and p > 0.99) then 99 # Don't round to 100% when it's not 100%!
      when (p > 0 and p < 0.01) then 1  # Don't round to 0% when it's not 0%!
      when (p > 1) then 100             # Don't let it go over 100%!
      else Math.round(p * 100)

    progressClass = classnames 'reading-progress-group',
      'none-completed': percent is 0

    if percent > 0
      completedLabel = "#{percent}%"
      if percent is 100
        completedLabel = "#{completedLabel} completed"

      # The threshold under which the filled-in part of the progress bar is too
      # smallto fit the percentage text on top, forcing us to add a css class
      # that will make it more legible
      maxSmallPercent = 10

      completed = <BS.ProgressBar
        className={classnames "reading-progress-bar",
          { 'small-percentage': percent <= maxSmallPercent }
        }
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
