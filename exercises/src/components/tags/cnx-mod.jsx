import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import Exercise from '../../models/exercises/exercise';
import MultiInput from './multi-input';

@observer
class CnxModTag extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
    };

    validateInput = (value) => {
        if (!value.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )) { return 'Must be the UUID of a module in the book (with hyphens)'; }
        return null
    };

    cleanInput = (val) => {
        return val.replace(/[^0-9a-f-]/g, '');
    }

    render() {
        return (
            <MultiInput
                {...this.props}
                label="Module UUID"
                type="context-cnxmod"
                cleanInput={this.cleanInput}
                validateInput={this.validateInput}
                placeholder="########-####-####-####-############" />
        );
    }
}

export default CnxModTag;
