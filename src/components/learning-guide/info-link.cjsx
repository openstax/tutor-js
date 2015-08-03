React = require 'react'
BS = require 'react-bootstrap'

MESSAGES = {
  student: [
      <p key='s1'>Tutor shows your weakest topics so you can practice to improve.</p>
      <p key='s2'>Try to get all of your topics to green!</p>
  ]
  teacher: [
      <p key='t1'>Tutor shows the weakest topics for each period.</p>
      <p key='t2'>Students may need your help in those areas.</p>
  ]
  teacher_student: [
      <p key='st1'>Tutor shows the weakest topics for the student.</p>
      <p key='st2'>They may need your help in those areas.</p>
  ]
}

module.exports = React.createClass

  displayName: 'LearningGuideInfoLink'
  type: React.PropTypes.oneOf(['student', 'teacher', 'teacher_student']).isRequired

  render: ->
    tooltip =
    <BS.Tooltip className='info-link-tooltip' html='true'>
      <p>The performance forecast is an estimate of your understanding of a topic.</p>
      <p>It is personalized display based on your answers to reading questions,
      homework problems, and previous practices.</p>
      {MESSAGES[@props.type]}
    </BS.Tooltip>

    <BS.OverlayTrigger placement='right' overlay={tooltip}>
      <span className='info-link'></span>
    </BS.OverlayTrigger>
