import React from 'react';
import cn from 'classnames';
import { Cell } from 'fixed-data-table-2';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import Percent from './percent';

const OverallCell = observer(({ ux, students, rowIndex }) => {
  const s = students[rowIndex];
  return (
    <Cell className={cn('overall-cell', { 'is-expanded': ux.isAveragesExpanded })}>
      <Percent className="course" nilAsNA value={s.course_average} />
      <div className="homework">
        <Percent className="score" nilAsNA value={s.homework_score} />
        <Percent className="completed" nilAsNA value={s.homework_progress} />
      </div>
      <div className="reading">
        <Percent className="score" nilAsNA value={s.reading_score} />
        <Percent className="completed" nilAsNA value={s.reading_progress} />
      </div>
    </Cell>
  );

});

export default OverallCell;
