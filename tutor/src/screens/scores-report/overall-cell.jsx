import React from 'react';
import { Cell } from 'fixed-data-table-2';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

const OverallCell = observer(({ ux, students, rowIndex }) => {
  let children = [
    <div key="overall">{((students[rowIndex].average_score || 0) * 100).toFixed(0)} %</div>,
  ];
  if (ux.isAveragesExpanded) {
    children = children.concat([
      <div key="overall-1">V#1</div>,
      <div key="overall-2">V#2</div>,
    ]);
  }
  return (
    <Cell className="overall-cell">
      {children}
    </Cell>
  );

});

export default OverallCell;
