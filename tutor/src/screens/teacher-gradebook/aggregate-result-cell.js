import { React, PropTypes } from 'vendor';
import { observer } from 'mobx-react';
import { sumBy, countBy, filter, isNil, isNaN } from 'lodash';
import { getCell } from './styles';
import S from '../../helpers/string';
import ScoresHelper, { UNWORKED } from '../../helpers/scores';

const Cell = getCell('0 10px');
window.ScoresHelper = ScoresHelper;

const getPoints = (tasks) => {
    const aggregatePoints = sumBy(tasks, (t) => t.published_points);
    return isNil(aggregatePoints) ? UNWORKED : ScoresHelper.formatPoints(aggregatePoints/tasks.length);
};

const getPercentage = (tasks) => {
    const aggregateScore = sumBy(tasks, (t) => parseFloat(t.published_score));
    if (isNil(aggregateScore) || isNaN(aggregateScore)) { return UNWORKED; }
    return `${ScoresHelper.asPercent(aggregateScore/tasks.length)}%`;
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
        value = ux.displayScoresAsPoints ? getPoints(tasksWithoutDroppedStudents) : getPercentage(tasksWithoutDroppedStudents);
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
