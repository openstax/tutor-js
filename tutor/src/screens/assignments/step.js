import { React, PropTypes, observer } from 'vendor';

import details from './details';
import chapters from './chapters';
import questions from './questions';
import review from './review';
import UnknownType from './unknown';

const STEPS = {
  details,
  chapters,
  questions,
  review,
};

const STEP_IDS = Object.keys(STEPS);

const Step = observer(({ ux }) => {
  const Component = STEPS[STEP_IDS[ux._stepIndex]] || UnknownType;
  return <Component ux={ux} />;
});

Step.propTypes = {
  ux: PropTypes.object.isRequired,
};


export { Step, STEP_IDS };
