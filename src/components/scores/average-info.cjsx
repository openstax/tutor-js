React  = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'

TUTOR_AVERAGE_INFO = '''
  Class averages are not displayed or included in the overall average until
   after the assignment due date.
   At that time, scores from all assignments, both complete and incomplete, are included.
  '''

CC_AVERAGE_INFO = '''
  Scores from completed assignments
   (in which all questions have been answered)
   are included in class and overall averages.
  '''


AverageInfo = React.createClass
  displayName: 'AverageInfo'

  propTypes:
    isConceptCoach: React.PropTypes.bool.isRequired

  render: ->
    title = 'Class and Overall Averages'

    body =
      if @props.isConceptCoach
        CC_AVERAGE_INFO
      else
        TUTOR_AVERAGE_INFO

    popover =
      <BS.Popover
        title={title}
        id="scores-average-info-popover"
        className="scores-average-info-popover">
          {body}
      </BS.Popover>



    <BS.OverlayTrigger
    ref="overlay"
    placement="right"
    trigger="click"
    rootClose={true}
    overlay={popover}>
      <Icon type='info-circle' />
    </BS.OverlayTrigger>



module.exports = AverageInfo
