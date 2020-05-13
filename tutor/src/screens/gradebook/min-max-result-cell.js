import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { minBy, maxBy } from 'lodash';
import { getCell } from './styles';
import S from '../../helpers/string';

const Cell = getCell('0 10px');

export const TYPE = {
  MIN: 'min',
  MAX: 'max',
};

const getMinOrMaxResultPoints = (data, type) => {
  const { tasks } = data;
  switch(type) {
    case TYPE.MIN:
      return minBy(tasks, 'correct_exercise_count').correct_exercise_count;
    case TYPE.MAX:
      return maxBy(tasks, 'correct_exercise_count').correct_exercise_count;
    default:
      return 0;
  }
};

const getMinOrMaxResultAverage = (data, type) => {
  const { tasks } = data;
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
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
      {ux.displayScoresAsPercent ? `${S.asPercent(getMinOrMaxResultAverage(data, type))}%` : `${S.numberWithOneDecimalPlace(getMinOrMaxResultPoints(data, type))}`}
    </Cell>
  );
});

MinMaxResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default MinMaxResult;
