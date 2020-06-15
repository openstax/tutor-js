import { React, styled, useObserver, css } from 'vendor';
import { observer } from 'mobx-react';
import { isNil } from 'lodash';
import { colors } from 'theme';
import TutorLink from '../../components/link';
import S, { UNWORKED } from '../../helpers/string';
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
      to="viewTask"
      data-assignment-type={`${task.type}`}
      params={{ courseId: course.id, id: task.id }}
    >
      {children}
    </TutorLink>
  );
});

const Points = observer(({ task }) => {
  const points = isNil(task.published_points) ? '0' : task.published_points;
  return <div className="correct-points">{S.numberWithOneDecimalPlace(points)}</div>;
});

const Percent = observer(({ task }) => {
  const display = isNil(task.published_score) ? '0%' : `${S.asPercent(task.published_score)}%`;
  return <div className="correct-score">{display}</div>;
});

const External = observer(({ task: { completed_step_count } }) => {
  return <div className="external">{completed_step_count > 0 && 'clicked'}</div>;
});

const TaskResult = observer(({ ux, task, striped, isLast }) => {
  let contents = null;
  if (task.isStarted || task.isDue) {
    
    let Component;

    if (task.isExternal){
      Component = External;
    } else if (ux.displayScoresAsPercent) {
      Component = Percent;
    } else {
      Component = Points;
    }

    const value = <Component task={task} />;

    contents = task.canBeReviewed ?
      <ReviewLink task={task}>{value}</ReviewLink> : value;
  } else {
    contents = <Unstarted>{UNWORKED}</Unstarted>;
  }

  return <StyledCell striped={striped} drawBorderBottom={isLast}>{contents}</StyledCell>;

});

export default TaskResult;
