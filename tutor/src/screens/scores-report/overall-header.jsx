import React from 'react';
import cn from 'classnames';
import Icon from '../../components/icon';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import SetWeights from './set-weights-modal';

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
