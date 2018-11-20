import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Exercise from '../../models/exercises/exercise';
import Wrapper from './wrapper';

import Multiselect from 'react-widgets/lib/Multiselect';

const TYPE = 'filter-type';
const TYPES = [
  { value: 'vocabulary',   title: 'Vocabulary' },
  { value: 'test-prep',    title: 'Test Prep' },
  { value: 'ap-test-prep', title: 'AP® Test Prep' },
];


@observer
class FilterTypeTag extends React.Component {
  static propTypes = {
    exercise: PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound updateTag(types) {
    this.props.exercise.tags.remove(
      this.props.exercise.tags.withType(TYPE)
    );
    types.forEach((type) => {
      this.props.exercise.tags.push({ type: TYPE, value: type.value });
    });
  }

  render() {
    const tags = map(this.props.exercise.tags.withType(TYPE, { multiple: true }), 'value');

    return (
      <Wrapper label="Filter Type">
        <div className="tag">
          <Multiselect
            valueField="value"
            textField="title"
            data={TYPES}
            value={tags}
            onChange={this.updateTag} />
        </div>
      </Wrapper>
    );
  }
}

export default FilterTypeTag;
