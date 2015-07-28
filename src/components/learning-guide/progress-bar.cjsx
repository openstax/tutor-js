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
      color = switch
        when percent >  75 then 'high'
        when percent >= 50 then 'medium'
        else 'low'
      <BS.ProgressBar className={color} now={percent} />
    else
      <span className="no-data">Practice section</span>

    if onPractice
      tooltip = <BS.Tooltip>Click to practice</BS.Tooltip>
      <BS.OverlayTrigger placement='bottom' overlay={tooltip}>
        <BS.Button onClick={-> onPractice(section)} block>{bar}</BS.Button>
      </BS.OverlayTrigger>
    else
      bar
