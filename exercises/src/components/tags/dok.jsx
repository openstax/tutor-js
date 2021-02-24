import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { range } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const CHOICES = {};
for (let i of Array.from(range(1, 5))) { CHOICES[i] = i; }

function DokTag(props) {
    return (
        <SingleDropdown {...props} label="DOK" type="dok" choices={CHOICES} />
    );
}

DokTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(DokTag);
