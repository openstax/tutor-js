import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Alert } from 'react-bootstrap';
import Books from '../tags/books';
import Lo from '../tags/lo';
import QuestionType from '../tags/question-type';
import FilterType from '../tags/filter-type';
import CnxMod from '../tags/cnx-mod';
import CnxFeature from '../tags/cnx-feature';
import Dok from '../tags/dok';
import Blooms from '../tags/blooms';
import Time from '../tags/time';
import RequiresContext from '../tags/requires-context';
import Exercise from '../../models/exercises/exercise';

function ExerciseTags({ exercise }) {
  const { validity } = exercise;
  const tagProps = { exercise };

  return (
    <div className="tags-panel">
      {!validity.valid && <Alert variant="warning">{validity.part}</Alert>}
      <div className="tags">
        <Books {...tagProps} />
        <Lo {...tagProps} />
        <QuestionType {...tagProps} />
        <FilterType {...tagProps} />
        <RequiresContext {...tagProps} />
        <CnxMod {...tagProps} />
        <CnxFeature {...tagProps} />
        <Dok {...tagProps} />
        <Blooms {...tagProps} />
        <Time {...tagProps} />
      </div>
    </div>
  );

}

ExerciseTags.propTypes = {
  exercise: PropTypes.instanceOf(Exercise).isRequired,
};


export default observer(ExerciseTags);
