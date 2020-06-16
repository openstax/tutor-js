import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { minBy, maxBy, filter } from 'lodash';
import { getCell } from './styles';
import S, { UNWORKED } from '../../helpers/string';

const Cell = getCell('0 10px');

export const TYPE = {
  MIN: 'min',
  MAX: 'max',
};

const getMinOrMaxResultPoints = (tasks, type) => {
  switch(type) {
    case TYPE.MIN:
      return minBy(tasks, 'points');
    case TYPE.MAX:
      return maxBy(tasks, 'points');
    default:
      return 0;
  }
};

const getMinOrMaxResultAverage = (tasks, type) => {
  switch(type) {
    case TYPE.MIN:
      return minBy(tasks, 'score');
    case TYPE.MAX:
      return maxBy(tasks, 'score');
    default:
      return 0;
  }
};

const MinMaxResult = observer(({ data, ux, type, drawBorderBottom }) => {
  if(data.type === 'external') {
    return (
      <Cell striped drawBorderBottom={drawBorderBottom}>
      n/a
      </Cell>
    );
  }
  const tasksWithoutDroppedStudents = filter(data.tasks, (t) => !t.student.is_dropped);
  let taskResult;
  let averageOrPoints;
  if(ux.displayScoresAsPercent) {
    taskResult =  getMinOrMaxResultAverage(tasksWithoutDroppedStudents, type);
    averageOrPoints = taskResult ? `${S.asPercent(taskResult.published_score)}%` : UNWORKED;
  }
  else {
    taskResult =  getMinOrMaxResultPoints(tasksWithoutDroppedStudents, type);
    averageOrPoints = taskResult ? `${S.numberWithOneDecimalPlace(taskResult.published_points)}` : UNWORKED;
  }
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
      {averageOrPoints}
    </Cell>
  );
});

MinMaxResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default MinMaxResult;
