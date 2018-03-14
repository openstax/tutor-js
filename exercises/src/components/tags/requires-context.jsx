import React from 'react';
import { first }  from 'lodash';
import Exercise from '../../models/exercises/exercise';

const PREFIX = 'requires-context';
import Wrapper from './wrapper';

class RequiresContextTag extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  updateTag = (ev) => {
    const tag = ev.target.checked ? 'true' : false; // false will remove tag
    return (
      this.props.actions.setPrefixedTag(this.props.id, { prefix: PREFIX, tag, replaceOthers: true })
    );
  };

  render() {
    const tag = first(this.props.exercise.tagsWithPrefix(PREFIX)) || 'false';

    return (
      <Wrapper label="Requires Context">
        <div className="tag">
          <input
            type="checkbox"
            label=""
            onChange={this.updateTag}
            checked={tag === 'true'} />
        </div>
      </Wrapper>
    );
  }
}

export default RequiresContextTag;
