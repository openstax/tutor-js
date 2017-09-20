import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import Icon from '../icon';

const TUTOR_AVERAGE_INFO = `\
Class averages are not displayed or included in the overall average until
 after the assignment due date.
 At that time, scores from all assignments, both complete and incomplete, are included.\
`;

const CC_AVERAGE_INFO = `\
Scores from completed assignments
 (in which all questions have been answered)
 are included in class and overall averages.\
`;


export default class AverageInfo extends React.PureComponent {

  static propTypes = {
    isConceptCoach: React.PropTypes.bool.isRequired,
  }

  render() {
    const title = 'Class and Overall Averages';

    const body =
      this.props.isConceptCoach ?
        CC_AVERAGE_INFO
        :
        TUTOR_AVERAGE_INFO;

    const popover =
      <Popover
        title={title}
        id="scores-average-info-popover"
        className="scores-average-info-popover">
        {body}
      </Popover>;


    return (
      <OverlayTrigger
        ref="overlay"
        placement="right"
        trigger="click"
        rootClose={true}
        overlay={popover}>
        <Icon type="info-circle" />
      </OverlayTrigger>
    );
  }
}
