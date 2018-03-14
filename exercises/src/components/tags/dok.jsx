import React from 'react';
import { range } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const CHOICES = {};
for (let i of Array.from(range(1, 5))) { CHOICES[i] = i; }

function DokTag(props) {
  return (
    <SingleDropdown {...props} label="DOK" prefix="dok" choices={CHOICES} />
  );
}

DokTag.propTypes = {
  exercise: React.PropTypes.instanceOf(Exercise).isRequired,
};

export default DokTag;
