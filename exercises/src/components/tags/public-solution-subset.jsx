import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import SingleDropdown from './single-dropdown';

const CHOICES = {
    even: 'Even-Numbered Solutions Are Public',
    odd: 'Odd-Numbered Solutions Are Public',
};

function PublicSolutionsSubsetTag(props) {
    return (
        <SingleDropdown
            {...props}
            label="Public Solutions Subset"
            type={Exercise.publicSolutionsSubsetType}
            choices={CHOICES} 
        />
    );
}

PublicSolutionsSubsetTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default observer(PublicSolutionsSubsetTag);
