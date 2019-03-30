import { React, PropTypes, observer, styled, observable, computed } from '../../helpers/react';
import Task from '../../models/student-tasks/task';
import { Icon } from 'shared';
import moment from 'moment-timezone';

const StyledTaskInfo = styled.div`
  display: flex;
  align-items: center;
`;

const IconStack = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
`;

const DueDate = styled(Icon)`
display: flex;
align-items: center;
margin-left: 0;
margin-right: 0;
`;

const CalendarText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  font-weight: bold;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
`;


@observer
class TaskInfo extends React.Component {

  static propTypes = {
    task: PropTypes.instanceOf(Task).isRequired,
  }

  render() {
    const { task } = this.props;

    const date = moment(task.due_at).date();

    return (
      <StyledTaskInfo>
        <IconStack
          className="task-due-date fa-stack"
          aria-label={`Due on ${date}`}
        >
          <DueDate
            type="calendar"
            onNavbar={true}
            className="fa-stack-2x"
            tooltip={`Due ${moment(task.due_at).calendar()}`}
          />
          <CalendarText className="fa-stack-1x calendar-text">
            {date}
          </CalendarText>
        </IconStack>
        <Title>{task.title}</Title>
      </StyledTaskInfo>
    );
  }

}

export { TaskInfo };
