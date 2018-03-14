import React from 'react';
import { first, map }  from 'lodash';
import Exercise from '../../models/exercises/exercise';

import Wrapper from './wrapper';

class SingleDropdown extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
    label:   React.PropTypes.string.isRequired,
    prefix:  React.PropTypes.string.isRequired,
  };

  updateTag = (ev) => {
    return (
      this.props.actions.setPrefixedTag(this.props.id,
        {tag: ev.target.value, prefix: this.props.prefix, replaceOthers: true}
      )
    );
  };

  render() {
    let tag, name;
    tag = first(this.props.exercise.tagsWithPrefix(this.props.prefix));

    return (
      <Wrapper label={this.props.label} singleTag={true}>
        <div className="tag">
          <select className="form-control" onChange={this.updateTag} value={tag}>
            {!tag && ( // a tag cannot be blank once it's set
               <option key="blank" value="">
                 {name}
               </option>
            )}
            {map(this.props.choices, (name, tag) => (
              <option key={tag} value={tag}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </Wrapper>
    );
  }
}

export default SingleDropdown;
