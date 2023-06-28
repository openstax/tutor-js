import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import { nursingBooks } from './nursingBooks';
import SingleDropdown from './single-dropdown';

const CHOICES = { 'y': 'Yes', 'n': 'No' };

function NCLEXTag(props) {
    const bookTags = props.exercise.tags.withType('book', { multiple: true });
    if (!bookTags.find(tag => nursingBooks.includes(tag.value))) {
        return null;
    }

    return (
        <SingleDropdown {...props} label="NCLEX" type="nursing" specifier="nclex" choices={CHOICES} />
    );
}

NCLEXTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(NCLEXTag);
