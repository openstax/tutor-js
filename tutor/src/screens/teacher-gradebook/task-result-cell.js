import { React, styled, useObserver, css } from 'vendor';
import { observer } from 'mobx-react';
import { isNil } from 'lodash';
import { colors } from 'theme';
import TutorLink from '../../components/link';
import S from '../../helpers/string';
import { getCell } from './styles';

const Cell = getCell('0, 10px');

const Unstarted = styled.div`
  color: ${colors.neutral.lite};
`;

const StyledCell = styled(Cell)`
    ${props => props.drawBorderBottom && css`
      border-bottom: 2px solid ${colors.neutral.pale};
    `}
`;

const ReviewLink = ({ task, children }) => useObserver(() => {
  const { course } = task.student.period;
  if (!course.currentRole.isTeacher) {
    return children;
  }
  return (
    <TutorLink
      to="viewTaskStep"
      data-assignment-type={`${task.type}`}
      params={{ courseId: course.id, id: task.id, stepIndex: 1 }}
    >
      {children}
    </TutorLink>
  );
});

const Points = ({ task }) => useObserver(() => {
  const points = isNil(task.points) ? '0' : task.points;
  return <div className="correct-points">{S.numberWithOneDecimalPlace(points)}</div>;
});

const Percent = ({ task: { score } }) => useObserver(() => {
  const display = isNil(score) ? '0%' : `${S.asPercent(score)}%`;
  return <div className="correct-score">{display}</div>;
});

const TaskResult = observer(({ ux, task, striped, isLast }) => {
  return useObserver(() => {
    let contents = null;
    if (task.isStarted || task.isDue) {
      const Display = ux.displayScoresAsPercent ? Percent : Points;

      const value = <Display task={task} />;

      contents = task.isStarted ?
        <ReviewLink task={task}>{value}</ReviewLink> : value;
    } else {
      contents = <Unstarted>---</Unstarted>;
    }

    return <StyledCell striped={striped} drawBorderBottom={isLast}>{contents}</StyledCell>;
  });
});

export default TaskResult;