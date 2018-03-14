import React from 'react';
import { map, isObject } from 'lodash';
import Exercise from '../../models/exercises/exercise';
import Wrapper from './wrapper';
import Multiselect from 'react-widgets/lib/Multiselect';

const PREFIX = 'filter-type';
const TYPES = [
  { id: 'vocabulary', title: 'Vocabulary' },
  { id: 'test-prep', title: 'Test Prep' },
  { id: 'ap-test-prep', title: 'AP® Test Prep' },
];

class FilterTypeTag extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  updateTag = (types) => {
    const tags = map(types, function(tag, v) {
      if (isObject(tag)) { return tag.id; } else { return tag; }
    });
    return (
      this.props.actions.setPrefixedTag(this.props.id, { prefix: PREFIX, tags })
    );
  };

  render() {
    const tags = this.props.exercise.tagsWithPrefix(PREFIX);

    return (
      <Wrapper label="Filter Type">
        <div className="tag">
          <Multiselect
            valueField="title"
            textField="title"
            valueField="id"
            data={TYPES}
            value={tags}
            onChange={this.updateTag} />
        </div>
      </Wrapper>
    );
  }
}

export default FilterTypeTag;
