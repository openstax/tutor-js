import React from 'react';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const PREFIX = 'type';
const TYPES = {
  'conceptual-or-recall': 'Conceptual or Recall',
  'conceptual': 'Conceptual',
  'recall': 'Recall',
  'practice': 'Practice',
};

function QuestionTypeTag(props) {
  return (
    <SingleDropdown {...props} label="Question Type" prefix={PREFIX} choices={TYPES} />
  );
}

QuestionTypeTag.propTypes = {
  exercise: React.PropTypes.instanceOf(Exercise).isRequired,
};

export default QuestionTypeTag;
