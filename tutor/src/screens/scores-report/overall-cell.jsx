import React from 'react';
import { Cell } from 'fixed-data-table-2';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

const OverallCell = observer(({ ux, students, rowIndex }) => {
  return (
    <Cell className="overall-cell">
      <div className="course">
        {((students[rowIndex].average_score || 0) * 100).toFixed(0)} %
      </div>
      <div className="homework">
        <div className="score">HS</div>
        <div className="completed">HP</div>
      </div>
      <div className="reading">
        <div className="score">RS</div>
        <div className="completed">RP</div>
      </div>
    </Cell>
  );

});

export default OverallCell;
