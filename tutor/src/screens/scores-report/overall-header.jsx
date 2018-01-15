import React from 'react';
import Icon from '../../components/icon';
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

const OverallHeader = observer(({ ux, period }) => {
  let labels = [
    <div key="overall">Course average</div>,
  ];
  let values = [
    <div key="overall">{(period.overall_average_score * 100).toFixed(0)}%</div>,
  ];
  if (ux.isAveragesExpanded) {
    labels = labels.concat([
      <div key="overall-1">H#1</div>,
      <div key="overall-2">H#2</div>,
    ]);
    values = values.concat([
      <div key="value-1">V#1</div>,
      <div key="value-2">V#2</div>,
    ]);
  }

  return (
    <div className="header-cell-wrapper overall-average">
      <div className="overall-header-cell">
        <OverlayTrigger trigger="click" rootClose overlay={<CourseAverageInfo />}>
          <Icon type="info-circle" />
        </OverlayTrigger>
        <Icon
          className="toggle-expanded"
          type={ux.isAveragesExpanded ? 'compress' : 'expand'}
          onClick={ux.toggleAverageExpansion}
        />
        <div className="labels">
          {labels}
        </div>
      </div>
      <div className="header-row values">
        {values}
      </div>
      <div className="header-row short" />
    </div>
  );
});

export default OverallHeader;
