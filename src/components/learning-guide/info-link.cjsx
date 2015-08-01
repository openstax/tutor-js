React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass

  displayName: 'LearningGuideInfoLink'

  render: ->
    tooltip =
    <BS.Tooltip className='info-link-tooltip' html='true'>
      <p>The performance forecast is an estimate of your understanding of a topic.</p>
      <p>It is personalized display based on your answers to reading questions,
      homework problems, and previous practices.</p>
      <p>Tutor shows you where you are weakest to you can
      focus your practice on areas that need improvement.</p>
      <p>Try to get all of your topics to green!</p>
    </BS.Tooltip>

    <BS.OverlayTrigger placement='right' overlay={tooltip}>
      <span className='info-link'></span>
    </BS.OverlayTrigger>
