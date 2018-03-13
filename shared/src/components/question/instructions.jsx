import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { keys } from 'lodash';
import { observer } from 'mobx-react';

import { TWO_STEP_ALIAS, getHelpText } from '../../helpers/step-helps';

const PROJECT_NAME_AND_FEEDBACK = {
  'concept-coach': {
    name: 'Concept Coach',
    feedbackType: 'immediate feedback',
  },
  'tutor': {
    name: 'Tutor',
    feedbackType: 'personalized feedback',
  },
};

const Instructions = observer((props) => {
  const { project, projectName, feedbackType, hasFeedback, hasIncorrectAnswer } = props;

  if (hasIncorrectAnswer && hasFeedback) {
    return (
      <p className="instructions">
        Incorrect. Please review your feedback.
      </p>
    );
  }

  const popover =
    <Popover ref="popover" id="instructions-help" className="openstax instructions">
      {getHelpText[TWO_STEP_ALIAS](project)}
    </Popover>;

  return (
    <p className="instructions">
      Now choose from one of the following options
      <OverlayTrigger placement="right" overlay={popover}>
        <span className="text-info">Why?</span>
      </OverlayTrigger>
    </p>
  );
});

Instructions.propTypes = {
  project: React.PropTypes.oneOf(keys(PROJECT_NAME_AND_FEEDBACK)),
  hasIncorrectAnswer: React.PropTypes.bool,
  hasFeedback: React.PropTypes.bool,
};

export default Instructions;
