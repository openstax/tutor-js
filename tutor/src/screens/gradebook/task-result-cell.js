import { React, styled, useObserver, css } from 'vendor';
import { isNil } from 'lodash';
import { Cell as TableCell } from 'react-sticky-table';
import { colors } from 'theme';
import TutorLink from '../../components/link';
import S from '../../helpers/string';

const Cell = styled(TableCell)`
  padding: 0;
  border-bottom: 0;
  text-align: center;
  vertical-align: middle;
  border-left: 2px solid ${colors.neutral.pale};
  &:last-child {
    border-right: 2px solid ${colors.neutral.pale};
  }
  ${props => props.striped && css`
    background: ${colors.neutral.lighter};
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

const Progress = ({ task }) => useObserver(() => {
  console.log(task);
  const progress = isNil(task.correct_exercise_count) ? '---' : task.humanScoreNumber;
  return <div className="correct-progress">{progress}</div>;
});

const Percent = ({ task: { score } }) => useObserver(() => {
  const display = isNil(score) ? '---' : `${S.asPercent(score)}%`;
  return <div className="correct-score">{display}</div>;
});

const Unstarted = styled.div`
  color: ${colors.neutral.lite};
`;

const TaskResult = ({ ux, task }) => {
  return useObserver(() => {
    let contents = null;
    if (task.isStarted || task.isDue) {
      const Display = ux.displayScoresAsPercent ? Percent : Progress;

      const value = <Display task={task} />;

      contents = task.isStarted ?
        <ReviewLink task={task}>{value}</ReviewLink> : value;
    } else {
      contents = <Unstarted>---</Unstarted>;
    }

    return <Cell>{contents}</Cell>;

    // return (
    //   <Cell>
    //     <Result isTrouble={result.isTrouble}>
    //       {result.isStarted ? S.numberWithOneDecimalPlace(result.score) : '…'}
    //     </Result>
    //   </Cell>
    // );
  });
};

export default TaskResult;
