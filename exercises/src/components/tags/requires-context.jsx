import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Exercise from '../../models/exercises/exercise';

const TYPE = 'requires-context';
import Wrapper from './wrapper';

@observer
class RequiresContextTag extends React.Component {
    static propTypes = {
        exercise: PropTypes.instanceOf(Exercise).isRequired,
    };

    @action.bound updateTag(ev) {
        if (ev.target.checked) {
            const tag = this.props.exercise.tags.findOrAddWithType(TYPE);
            tag.value = 'true';
        } else {
            const tag = this.props.exercise.tags.withType(TYPE);
            if (tag) { this.props.exercise.tags.remove(tag); }
        }
    }

    render() {
        const tag = this.props.exercise.tags.withType(TYPE) || { value: 'false' };

        return (
            <Wrapper label="Requires Context">
                <div className="tag">
                    <input
                        type="checkbox"
                        label=""
                        onChange={this.updateTag}
                        checked={tag.value === 'true'} />
                </div>
            </Wrapper>
        );
    }
}

export default RequiresContextTag;
