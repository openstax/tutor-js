import React from 'react';
import { range } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const CHOICES = {};
for (let i of Array.from(range(1, 8))) { CHOICES[i] = i; }

function BloomsTag(props) {
  return (
    <SingleDropdown {...props} label="Blooms" prefix="blooms" choices={CHOICES} />
  );
}

BloomsTag.propTypes = {
  exercise: React.PropTypes.instanceOf(Exercise).isRequired,
};

export default BloomsTag;
