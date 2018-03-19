import React from 'react';
import cn from 'classnames';
import { Cell } from 'fixed-data-table-2';
import { observer } from 'mobx-react';

const OverallCell = observer(({ ux, rowIndex }) => {
  const studentAverages = ux.periodStudentsAverages[rowIndex];
  return (
    <Cell className={cn('overall-cell', { 'is-expanded': ux.isAveragesExpanded })}>
      <div className="course">
        {studentAverages.course_average}
      </div>
      <div className="homework">
        <div className="score">{studentAverages.homework_score}</div>
        <div className="completed">{studentAverages.homework_progress}</div>
      </div>
      <div className="reading">
        <div className="score">{studentAverages.reading_score}</div>
        <div className="completed">{studentAverages.reading_progress}</div>
      </div>
    </Cell>
  );
});

export default OverallCell;
