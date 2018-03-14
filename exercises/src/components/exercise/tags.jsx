import React from 'react';
import { Row } from 'react-bootstrap';
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

  const tagProps = { exercise };

  return (
    <div className="tags">
      <Row>
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
      </Row>
    </div>
  );

}

ExerciseTags.propTypes = {
  exercise: React.PropTypes.instanceOf(Exercise).isRequired,
};


export default ExerciseTags;
