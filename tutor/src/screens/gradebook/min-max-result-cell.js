import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { minBy, maxBy, filter } from 'lodash';
import { getCell } from './styles';
import S from '../../helpers/string';

const Cell = getCell('0 10px');

export const TYPE = {
  MIN: 'min',
  MAX: 'max',
};

const getMinOrMaxResultPoints = (tasks, type) => {
  switch(type) {
    case TYPE.MIN:
      return minBy(tasks, 'correct_exercise_count').correct_exercise_count;
    case TYPE.MAX:
      return maxBy(tasks, 'correct_exercise_count').correct_exercise_count;
    default:
      return 0;
  }
};

const getMinOrMaxResultAverage = (tasks, type) => {
  switch(type) {
    case TYPE.MIN:
      return minBy(tasks, 'score').score;
    case TYPE.MAX:
      return maxBy(tasks, 'score').score;
    default:
      return 0;
  }
};

const MinMaxResult = observer(({ data, ux, type, drawBorderBottom }) => {
  const tasksWithoutDroppedStudents = filter(data.tasks, (t) => !t.student.is_dropped);
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
      {ux.displayScoresAsPercent
        ? `${S.asPercent(getMinOrMaxResultAverage(tasksWithoutDroppedStudents, type))}%`
        : `${S.numberWithOneDecimalPlace(getMinOrMaxResultPoints(tasksWithoutDroppedStudents, type))}`}
    </Cell>
  );
});

MinMaxResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default MinMaxResult;
