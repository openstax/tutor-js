import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import MultiSelect from './multi-select';

const TYPES = [
  { value: 'reading', label: 'Reading' },
  { value: 'homework', label: 'Homework' },
];

function QuestionTypeTag(props) {
  const { isOpenEnded } = props.exercise;
  return (
    <MultiSelect
      {...props}
      readonly={isOpenEnded}
      tagType="assignment-type"
      label="Assignment Type"
      options={TYPES}
    />
  );
}

QuestionTypeTag.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(QuestionTypeTag);
