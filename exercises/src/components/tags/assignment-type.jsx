import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'shared';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import MultiSelect from './multi-select';

const TYPE = 'type';
const TYPES = [
  { value: 'reading', label: 'Reading' },
  { value: 'homework', label: 'Homework' },
  { value: 'practice', label: 'Practice' },
];

function QuestionTypeTag(props) {
  const { isOpenEnded } = props.exercise;
  return (
    <MultiSelect
      {...props}
      readonly={isOpenEnded}
      tagType="assignment-type"
      label="Assignment Type"
      type={TYPE}
      options={TYPES}
      icon={isOpenEnded && <Icon variant="infoCircle" tooltip='"Open Ended" exercises must be type practice' />}
    />
  );
}

QuestionTypeTag.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(QuestionTypeTag);
