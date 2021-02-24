import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import SingleDropdown from './single-dropdown';
import Exercise from '../../models/exercises/exercise';

const CHOICES = {
    'short': 'Short',
    'medium': 'Medium',
    'long': 'Long',
};

function TimeTag(props) {
    return (
        <SingleDropdown {...props} label="Time" type="time" choices={CHOICES} />
    );
}

TimeTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(TimeTag);
