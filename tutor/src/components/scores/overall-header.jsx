import React from 'react';
import Icon from '../icon';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

const CourseAverageInfo = (props) => {
  const { style } = props;
  style.top += 125;
  return (
    <Popover
      id="course-average-popover"
      {...props}
      arrowOffsetTop={80}
      style={style}
      className="course-average-help"
    >
      <h3>Course Average</h3>
      <p>
        This is the average of all homework assignment scores.  Reading assignment scores or progress averages are not included in the course average.  This is what is sent to your LMS when you use the Send-to-LMS feature.
      </p>
      <p className="no-reading-heading">
        Why aren't reading scores included in the course average?
      </p>
      <p>
        OpenStax believes OpenStax Tutor works best when students can answer reading questions without concern that it will impact their course average. If you still would like to include reading scores in your performance assessment, export the scores as a spreadsheet where those scores are included.
      </p>
    </Popover>
  );
};

const OverallHeader = observer(({ period }) => (
  <div className="header-cell-wrapper overall-average">
    <div className="overall-header-cell">
      <OverlayTrigger trigger="click" rootClose overlay={<CourseAverageInfo />}>
        <Icon type="info-circle" />
      </OverlayTrigger>
      <span>Course average</span>
    </div>
    <div className="header-row">
      <span>
        {(period.overall_average_score * 100).toFixed(0)}%
      </span>
    </div>
    <div className="header-row short" />
  </div>
));

export default OverallHeader;
