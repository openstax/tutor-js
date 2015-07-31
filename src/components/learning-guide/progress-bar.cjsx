React = require 'react'
BS = require 'react-bootstrap'

ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'LearningGuideProgressBar'

  propTypes:
    section:  React.PropTypes.object.isRequired
    onPractice: React.PropTypes.func

  render: ->
    {section,  onPractice} = @props

    bar = if section.current_level
      percent = Math.round((section.current_level / 1) * 100)
      # always show at least 5% of bar, otherwise it just looks empty
      <BS.ProgressBar className={section.interpretation} now={Math.max(percent, 5)} />
    else
      <span className="no-data">Practice section</span>

    if onPractice
      tooltip = <BS.Tooltip>Click to practice</BS.Tooltip>
      <BS.OverlayTrigger placement='bottom' overlay={tooltip}>
        <BS.Button onClick={-> onPractice(section)} block>{bar}</BS.Button>
      </BS.OverlayTrigger>
    else
      bar
