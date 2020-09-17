import {
  React, PropTypes, styled, observer,
} from 'vendor';
import UX from './ux';
import ExerciseTaskHeader from './exercise-task-header';
import { TaskStep } from './step';
import AssignmentClosedBanner from './assignment-closed-banner';

const SyledHomework = styled.div`

`;

@observer
class HomeworkTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, windowImpl } = this.props;

    return (
      <SyledHomework className="homework-task">
        <ExerciseTaskHeader ux={ux} unDocked />
        {ux.task.isAssignmentClosed && <AssignmentClosedBanner />}
        <TaskStep
          ux={ux}
          step={ux.currentGroupedStep}
          windowImpl={windowImpl}
        />
      </SyledHomework>
    );
  }

}

export default HomeworkTask;
