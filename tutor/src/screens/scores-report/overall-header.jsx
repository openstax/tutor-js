import React from 'react';
import cn from 'classnames';
import Icon from '../../components/icon';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import SetWeights from './set-weights-modal';

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


const AveragesToggle = observer(({ ux }) => (
  <Icon
    className="averages-toggle"
    type={ux.isAveragesExpanded ? 'chevron-left' : 'chevron-right'}
    onClick={ux.toggleAverageExpansion}
  />
));

const OverallHeader = observer(({ ux, period }) => {

  return (
    <div className={cn('header-cell-wrapper', 'overall-average', { 'is-expanded': ux.isAveragesExpanded })}>
      <SetWeights ux={ux} />
      <div className="overall-header-cell">
        <AveragesToggle ux={ux} />
        <OverlayTrigger trigger="click" rootClose overlay={<CourseAverageInfo />}>
          <Icon type="info-circle" />
        </OverlayTrigger>
        <div className="avg">
          <b>Averages</b>
          <a className="set-weights" onClick={ux.weights.onSetClick}>Set weights</a>
        </div>
      </div>
      <div className="header-row labels">
        <div>Course</div>
        <div className="homework">Homework</div>
        <div className="reading">Reading</div>
      </div>
      <div className="header-row labels types">
        <div></div>
        <div className="homework">
          <div>Score</div>
          <div>Progress</div>
        </div>
        <div className="reading">
          <div>Score</div>
          <div>Progress</div>
        </div>
      </div>
      <div className="header-row values">
        <div>{(period.overall_average_score * 100).toFixed(0)}%</div>
        <div className="homework">
          <div>S Val</div>
          <div>P Val</div>
        </div>
        <div className="reading">
          <div>S Val</div>
          <div>P Val</div>
        </div>
      </div>
    </div>
  );
});

export default OverallHeader;
