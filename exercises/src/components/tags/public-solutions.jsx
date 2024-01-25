import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, modelize } from 'shared/model';
import Exercise from '../../models/exercises/exercise';
import Wrapper from './wrapper';

@observer
class PublicSolutions extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound updateValue(ev) {
        const value = ev.target.checked;
        this.props.exercise.solutions_are_public = value;
        if (this.props.onChange !== undefined) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <Wrapper label="Solution is public">
                <input
                    type="checkbox"
                    label=""
                    onChange={this.updateValue}
                    checked={this.props.exercise.solutions_are_public} />
            </Wrapper>
        );
    }
}

export default PublicSolutions;
