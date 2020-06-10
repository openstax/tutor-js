import React from 'react';
import { Button } from 'react-bootstrap';
import cn from 'classnames';
import { Icon } from 'shared';
import Theme from '../../theme';
import { observer } from 'mobx-react';
import SetWeights from './set-weights-modal';
import ViewWeights from './view-weights-modal';

const AveragesToggle = observer(({ ux }) => (
  <Icon
    className="averages-toggle"
    type={ux.isAveragesExpanded ? 'chevron-left' : 'chevron-right'}
    onClick={ux.toggleAverageExpansion}
    tooltip={`${(ux.isAveragesExpanded && 'Hide') || 'Show'} assignment averages`}
  />
));


const WeightsLink = observer(({ ux }) => {
  if (ux.isTeacher) {
    return (
      <Button variant="link" className="set-weights" onClick={ux.weights.onSetClick}>
        View weights
        {!ux.areWeightsInUse &&
          <Icon
            type="exclamation-triangle"
            color={Theme.colors.danger}
            tooltipProps={{ placement: 'top' }}
            tooltip="Change weights to generate course averages" />}
      </Button>
    );
  } else {
    return (
      <a className="set-weights" onClick={ux.weights.onSetClick}>
        View weights
      </a>
    );
  }
});

const OverallHeader = observer(({ ux }) => {
  const { periodAverages } = ux;
  let overviewHeaderRow = null;
  let weightsModal = <ViewWeights ux={ux} />;

  if (ux.isTeacher) {
    overviewHeaderRow = (
      <div className="header-row values overview-row">
        <div>{periodAverages.overall_course_average}</div>
        <div className="homework">
          <div>{periodAverages.overall_homework_score}</div>
          <div>{periodAverages.overall_homework_progress}</div>
        </div>
        <div className="reading">
          <div>{periodAverages.overall_reading_score}</div>
          <div>{periodAverages.overall_reading_progress}</div>
        </div>
      </div>
    );

    weightsModal = <SetWeights ux={ux} />;
  }

  return (
    <div className={cn('header-cell-wrapper', 'overall-average', { 'is-expanded': ux.isAveragesExpanded })}>
      {weightsModal}
      <div className="overall-header-cell">
        <AveragesToggle ux={ux} />
        <div className="avg">
          <b>Averages</b>
          <WeightsLink ux={ux} />
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
      {overviewHeaderRow}
    </div>
  );
});

export default OverallHeader;
