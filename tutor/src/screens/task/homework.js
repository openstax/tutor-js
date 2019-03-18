import { React, PropTypes, observer, computed } from '../../helpers/react';
import { BulletList as PendingLoad } from 'react-content-loader';
import UX from './ux';
import Card from './step/card';

import { exercise as Exercise } from './step';

export default
@observer
class ExerciseTask extends React.Component {

  render() {
    const { ux, windowImpl, ux: { currentStep } } = this.props;
    let step;

    if (!currentStep.isFetched) {
      step = <PendingLoad />;
    } else {
      step = <Exercise ux={ux} windowImpl={windowImpl} />;
    }


    return (
      <Card>
        {step}
      </Card>
    );
  }


}
