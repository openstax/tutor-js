import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import MultiInput from './multi-input';

@observer
class CnxFeature extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
    };

    validateInput = (value) => {
        if (!value.match(
            /^[\w-]+$/i
        )) { return 'Must be the ID of the HTML element containing the feature (alphanumeric characters, hyphens and/or underscores only)'; }
    };

    cleanInput = (val) => {
        return val.replace(/[^\w-]/g, '');
    };

    render() {
        return (
            <MultiInput
                {...this.props}
                label="Element ID"
                type="context-cnxfeature"
                cleanInput={this.cleanInput}
                placeholder="feature-id"
                validateInput={this.validateInput} />
        );
    }
}

export default CnxFeature;
