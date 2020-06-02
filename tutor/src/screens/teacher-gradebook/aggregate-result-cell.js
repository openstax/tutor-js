import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { sumBy, filter } from 'lodash';
import { getCell } from './styles';
import S from '../../helpers/string';


const Cell = getCell('0 10px');

const getPoints = (tasks) => {
  const aggregatePoints = sumBy(tasks, (t) => t.points);
  return S.numberWithOneDecimalPlace(aggregatePoints/tasks.length);
};

const getPercentage = (tasks) => {
  const aggregateScore = sumBy(tasks, (t) => parseFloat(t.score, 10));
  return `${S.asPercent(aggregateScore/tasks.length)}%`;
};


const AggregateResult = observer(({ data, ux, drawBorderBottom }) => {
  const tasksWithoutDroppedStudents = filter(data.tasks, (t) => !t.student.is_dropped);
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
      {ux.displayScoresAsPercent ? getPercentage(tasksWithoutDroppedStudents) : getPoints(tasksWithoutDroppedStudents)}
    </Cell>
  );
});

AggregateResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default AggregateResult;
