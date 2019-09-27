import { React, PropTypes, observer, styled } from 'vendor';
import Task from '../../models/student-tasks/task';
import TimeHelper from '../../helpers/time';

const StyledTaskInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
`;

const DueDate = styled.div`
  margin-left: 1rem;
`;


@observer
class TaskInfo extends React.Component {
  static displayName = 'TaskInfo'
  static propTypes = {
    task: PropTypes.instanceOf(Task).isRequired,
  }

  render() {
    const { task } = this.props;

    return (
      <StyledTaskInfo>
        <Title>{task.title}</Title>
        {task.due_at &&
          <DueDate>due {TimeHelper.toShortHumanDateTime(task.due_at)}</DueDate>}
      </StyledTaskInfo>
    );
  }

}

export { TaskInfo };
