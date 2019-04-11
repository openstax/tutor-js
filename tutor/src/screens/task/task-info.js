import { React, PropTypes, observer, styled } from '../../helpers/react';
import Task from '../../models/student-tasks/task';
import moment from 'moment-timezone';

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

  static propTypes = {
    task: PropTypes.instanceOf(Task).isRequired,
  }

  render() {
    const { task } = this.props;

    return (
      <StyledTaskInfo>
        <Title>{task.title}</Title>
        <DueDate>due {moment(task.due_at).calendar()}</DueDate>
      </StyledTaskInfo>
    );
  }

}

export { TaskInfo };
