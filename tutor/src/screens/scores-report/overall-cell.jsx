import React from 'react';
import { Cell } from 'fixed-data-table-2';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { asPercent } from '../../helpers/string';

const OverallCell = observer(({ ux, students, rowIndex }) => {
  const s = students[rowIndex];
  return (
    <Cell className="overall-cell">
      <div className="course">
        {asPercent(s.course_average)}%
      </div>
      <div className="homework">
        <div className="score">{asPercent(s.homework_score)}%</div>
        <div className="completed">{asPercent(s.homework_progress)}%</div>
      </div>
      <div className="reading">
        <div className="score">{asPercent(s.reading_score)}%</div>
        <div className="completed">{asPercent(s.reading_progress)}%</div>
      </div>
    </Cell>
  );

});

export default OverallCell;
