import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import MultiSelect from './multi-select';

const OPTIONS = [
  { value: 'vocabulary',   label: 'Vocabulary' },
  { value: 'test-prep',    label: 'Test Prep' },
  { value: 'ap-test-prep', label: 'AP® Test Prep' },
];

const FilterTypeTag = observer(({ exercise }) => {
  return (
    <MultiSelect
      exercise={exercise}
      label="Filter Type"
      tagType="filter-type"
      options={OPTIONS}
    />
  );
});

FilterTypeTag.displayName = 'FilterTypeTag';
FilterTypeTag.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default FilterTypeTag;
