import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Alert } from 'react-bootstrap';
import Books from '../tags/books';
import Lo from '../tags/lo';
import AssignmentType from '../tags/assignment-type';
import CnxMod from '../tags/cnx-mod';
import CnxFeature from '../tags/cnx-feature';
import Dok from '../tags/dok';
import Blooms from '../tags/blooms';
import Time from '../tags/time';
import HistoricalThinking from '../tags/historical-thinking';
import ReasoningProcess from '../tags/reasoning-process';
import Aacn from '../tags/aacn';
import ApLo from '../tags/aplo';
import SciencePractice from '../tags/science-practice';
import PublicSolutions from '../tags/public-solutions';
import Exercise from '../../models/exercises/exercise';

function ExerciseTags({ exercise }) {
    const { validity } = exercise;
    const tagProps = { exercise };

    return (
        <div className="tags-panel">
            {!validity.valid && <Alert variant="warning">{validity.part}</Alert>}
            <div className="tags">
                <Books {...tagProps} />
                <SciencePractice {...tagProps} />
                <Lo {...tagProps} />
                <ApLo {...tagProps} />
                <Aacn {...tagProps} />
                <AssignmentType {...tagProps} />
                <HistoricalThinking {...tagProps} />
                <ReasoningProcess {...tagProps} />
                <CnxMod {...tagProps} />
                <CnxFeature {...tagProps} />
                <Dok {...tagProps} />
                <Blooms {...tagProps} />
                <Time {...tagProps} />
                <PublicSolutions {...tagProps} />
            </div>
        </div>
    );
}

ExerciseTags.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};


export default observer(ExerciseTags);
