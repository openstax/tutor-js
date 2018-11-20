import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const TYPE = 'type';
const TYPES = {
  'conceptual-or-recall': 'Conceptual or Recall',
  'conceptual': 'Conceptual',
  'recall': 'Recall',
  'practice': 'Practice',
};

function QuestionTypeTag(props) {
  return (
    <SingleDropdown
      {...props} label="Question Type" type={TYPE} choices={TYPES}
    />
  );
}

QuestionTypeTag.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(QuestionTypeTag);
