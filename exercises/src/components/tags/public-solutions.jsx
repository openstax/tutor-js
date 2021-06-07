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
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound updateValue(ev) {
        this.props.exercise.solutions_are_public = ev.target.checked;
    }

    render() {
        return (
            <Wrapper label="Public Solutions?">
                <div className="tag">
                    <input
                        type="checkbox"
                        label=""
                        onChange={this.updateValue}
                        checked={this.props.exercise.solutions_are_public} />
                </div>
            </Wrapper>
        );
    }
}

export default PublicSolutions;
