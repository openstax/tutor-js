import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { range } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import MultiSelect from './multi-select';

const OPTIONS = range(1, 4).map(i => ({
    value: `${i}`,
    label: `${i}`,
}));

const ReasoningProcessTag = observer(({ exercise }) => {
    if (!exercise.tags.includes({ type: 'book', value: 'stax-apush' })) {
        return null;
    }
    return (
        <MultiSelect
            exercise={exercise}
            label="Reasoning Process"
            tagType="rp"
            options={OPTIONS}
        />
    );
});
ReasoningProcessTag.displayName = 'ReasoningProcessTag';
ReasoningProcessTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default ReasoningProcessTag;
