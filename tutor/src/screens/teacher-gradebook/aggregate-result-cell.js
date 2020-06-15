import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { sumBy, countBy, filter, isNil } from 'lodash';
import { getCell } from './styles';
import S, { UNWORKED } from '../../helpers/string';


const Cell = getCell('0 10px');

const getPoints = (tasks) => {
  const aggregatePoints = sumBy(tasks, (t) => t.points);
  return isNil(aggregatePoints) ? UNWORKED : S.numberWithOneDecimalPlace(aggregatePoints/tasks.length);
};

const getPercentage = (tasks) => {
  const aggregateScore = sumBy(tasks, (t) => parseFloat(t.score, 10));
  return isNil(aggregateScore) ? UNWORKED : `${S.asPercent(aggregateScore/tasks.length)}%`;
};


const AggregateResult = observer(({ data, ux, drawBorderBottom }) => {
  if(data.type === 'external') {
    return (
      <Cell striped drawBorderBottom={drawBorderBottom}>
      n/a
      </Cell>
    );
  }
  const tasksWithoutDroppedStudents = filter(data.tasks, (t) => !t.student.is_dropped);
  let value = '';
  if (data.isExternal) {
    const counts = countBy(tasksWithoutDroppedStudents, 'completed_step_count');
    value = S.asPercent(counts['1'] / tasksWithoutDroppedStudents.length) + '%';
  } else {
    value = ux.displayScoresAsPercent ? getPercentage(tasksWithoutDroppedStudents) : getPoints(tasksWithoutDroppedStudents);
  }
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
      {value}
    </Cell>
  );
});

AggregateResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default AggregateResult;
