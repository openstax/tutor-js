import { React, PropTypes, observer, computed } from '../../helpers/react';
import { Code as PendingLoad } from 'react-content-loader'
import ProgressCard from './progress';
import UX from './ux';
import Card from './step/card';


import * as STEP_TYPES from './step';


const UnknownStepType = ({ step }) => (
  <h1>Unknown step type "{step.type || 'null'}"</h1>
);


export default
@observer
class ReadingTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux, ux: { currentStep } } = this.props;
    let step;

    if (!currentStep.isFetched) {
      step = <PendingLoad />;
    } else {
      const Step = STEP_TYPES[currentStep.type] || UnknownStepType
      step = <Step ux={ux} />;
    }

    return (
      <ProgressCard ux={ux}>
        <Card {...ux.courseAppearanceDataProps}>
          {step}
        </Card>
      </ProgressCard>
    );
  }

};
