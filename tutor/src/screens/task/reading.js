import { React, PropTypes, observer } from '../../helpers/react';
import ProgressCard from './progress';
import UX from './ux';
import TaskStep from './step';

export default
@observer
class ReadingTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, windowImpl, ux: { currentStep } } = this.props;

    return (
      <ProgressCard ux={ux} className="reading-task">
        <TaskStep
          ux={ux}
          step={currentStep}
          windowImpl={windowImpl}
        />
      </ProgressCard>
    );
  }

}
