import { React, PropTypes, observer, computed } from '../../helpers/react';
import { Code as PendingLoad } from 'react-content-loader';
import ProgressCard from './progress';
import UX from './ux';
import Card from './step/card';

import * as STEP_TYPES from './step';


export default
@observer
class ReadingTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, windowImpl, ux: { currentStep } } = this.props;
    let step;

    if (!currentStep.isFetched) {
      step = <PendingLoad />;
    } else {
      const Step = STEP_TYPES[currentStep.type] || STEP_TYPES.unknown;
      step = <Step windowImpl={windowImpl} ux={ux} />;
    }

    return (
      <ProgressCard ux={ux}>
        <Card {...ux.courseAppearanceDataProps}>
          {step}
        </Card>
      </ProgressCard>
    );
  }

}
