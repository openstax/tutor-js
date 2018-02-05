import React from 'react';
import cn from 'classnames';
import Icon from '../../components/icon';
import { asPercent } from '../../helpers/string';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import SetWeights from './set-weights-modal';

const AveragesToggle = observer(({ ux }) => (
  <Icon
    className="averages-toggle"
    type={ux.isAveragesExpanded ? 'chevron-left' : 'chevron-right'}
    onClick={ux.toggleAverageExpansion}
    tooltip={`${(ux.isAveragesExpanded && 'Hide') || 'Show'} assignment averages`}
  />
));

const OverallHeader = observer(({ ux, period }) => {

  return (
    <div className={cn('header-cell-wrapper', 'overall-average', { 'is-expanded': ux.isAveragesExpanded })}>
      <SetWeights ux={ux} />
      <div className="overall-header-cell">
        <AveragesToggle ux={ux} />
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
      <div className="header-row values overview-row">
        <div>{asPercent(period.overall_course_average)}%</div>
        <div className="homework">
          <div>{asPercent(period.overall_homework_score)}%</div>
          <div>{asPercent(period.overall_homework_progress)}%</div>
        </div>
        <div className="reading">
          <div>{asPercent(period.overall_reading_score)}%</div>
          <div>{asPercent(period.overall_reading_progress)}%</div>
        </div>
      </div>
    </div>
  );
});

export default OverallHeader;
