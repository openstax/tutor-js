import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const AP_PHYSICS = {
  'modeling': 'Modeling',
  'mathematical-routines': 'Mathematical Routines',
  'scientific-reasoning': 'Scientific Reasoning',
  'experimental-methods': 'Experimental Methods',
  'data-analysis': 'Data Analysis',
  'argumentation': 'Argumentation',
  'making-connections': 'Making Connections',
};

const AP_BIO = {
  'concept-explanation': 'Concept Explanation',
  'visual-representations': 'Visual Representations',
  'questions-methods': 'Questions and Methods',
  'representing-describing-data': 'Representing and Describing Data',
  'statistical-tests-data-analysis': 'Statistical Tests and Data Analysis',
  'argumentation': 'Argumentation',
};

const getBookTagValue = (tags) => {
  const tag = tags.withType('book');
  return tag ? tag.value : '';
};

const SciencePracticeTags = (props) => {
  const bookTagValue = getBookTagValue(props.exercise.tags);

  let choices;
  if(bookTagValue === 'stax-apphys') {
    choices = AP_PHYSICS;
  }
  if(bookTagValue === 'stax-apbio') {
    choices = AP_BIO;
  }

  if(!choices) {
    return null;
  }
  return (
    <SingleDropdown {...props} label="Science Practice" type="science-practice" choices={choices} />
  );
};

SciencePracticeTags.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(SciencePracticeTags);
