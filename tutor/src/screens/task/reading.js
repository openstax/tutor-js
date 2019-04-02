import { React, PropTypes, observer } from '../../helpers/react';
import ProgressCard from './progress';
import UX from './ux';
import { TaskStep } from './step';
import ObscuredPage from '../../components/obscured-page';

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

        <ObscuredPage>
          <TaskStep
            ux={ux}
            key={currentStep}
            step={currentStep}
            windowImpl={windowImpl}
          />
        </ObscuredPage>
      </ProgressCard>
    );
  }

}
