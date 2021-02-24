import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { range } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import MultiSelect from './multi-select';

const OPTIONS = range(1, 7).map(i => ({
    value: `${i}`,
    label: `${i}`,
}));

const HistoricalThinkingTag = observer(({ exercise }) => {
    if (!exercise.tags.includes({ type: 'book', value: 'stax-apush' })) {
        return null;
    }
    return (
        <MultiSelect
            exercise={exercise}
            label="Historical Thinking"
            tagType="hts"
            options={OPTIONS}
        />
    );
});
HistoricalThinkingTag.displayName = 'HistoricalThinkingTag';
HistoricalThinkingTag.propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
};

export default HistoricalThinkingTag;
