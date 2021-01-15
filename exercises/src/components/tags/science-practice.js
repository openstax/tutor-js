import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { filter, some, reduce } from 'lodash';
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

const ALL_AP_BOOKS = [
  {
    tag: 'stax-apphys',
    choices: AP_PHYSICS,
  },
  {
    tag: 'stax-apbio',
    choices: AP_BIO,
  },
];

const getApBookTags = (tags) => {
  const booksTag = tags.withType('book', { multiple: true });
  return filter(ALL_AP_BOOKS, aab => some(booksTag, bt => bt.value === aab.tag));
};

const SciencePracticeTags = (props) => {
  // const bookTags = getBookTags(props.exercise.tags);
  // const filteredApBooks = filter(apBooks, sb => some(bookTags, bt => bt.value === sb.tag));

  const [apBooks, setApBooks] = useState(getApBookTags(props.exercise.tags));

  useEffect(() => {
    const updatedApBooks = getApBookTags(props.exercise.tags);
    setApBooks(updatedApBooks);
  }, [props]);

  if(apBooks.length <= 0) return null;

  // A way to handle if both AP books are selected.
  // Theresa said it will not happen, but we need to handle this scenario.
  const choices = useMemo(() =>
    reduce(apBooks, (result, book) => {
      return { ...result, ...book.choices };
    }, {}), 
  [apBooks]); 

  return (
    <SingleDropdown {...props} label="Science Practice" type="science-practice" choices={choices} />
  );
};

SciencePracticeTags.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(SciencePracticeTags);
