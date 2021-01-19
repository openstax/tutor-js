import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'shared';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const TYPE = 'type';
const TYPES = {
  'conceptual-or-recall': 'Reading or Homework',
  'conceptual': 'Reading',
  'recall': 'Homework',
  'practice': 'Practice',
};

function QuestionTypeTag(props) {
  const { isOpenEnded } = props.exercise;
  return (
    <SingleDropdown
      readonly={isOpenEnded}
      {...props} label="Question Type" type={TYPE} choices={TYPES}
      icon={isOpenEnded && <Icon variant="infoCircle" tooltip='"Open Ended" exercises must be type practice' />}
    />
  );
}

QuestionTypeTag.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(QuestionTypeTag);
