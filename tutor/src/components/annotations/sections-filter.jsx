import PropTypes from 'prop-types';
import React from 'react';
import Multiselect from '../multi-select';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { filter, map } from 'lodash';

export default
@observer
class SectionsFilter extends React.Component {

  static propTypes = {
    sections: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
  };

  @action.bound onSelect({ id, selected }) {
    this.props.selected.set(id, !selected);
  }

  @computed get choices() {
    return map(this.props.sections, (notes, id) => (
      {
        id,
        title: (
          <span>
            <span className="section">{notes[0].formattedChapterSection}</span>
            <span>{notes[0].title}</span>
          </span>
        ),
        selected: this.props.selected.get(id),
      }
    ));
  }

  render() {
    return (
      <div className="filter-widget">
        <Multiselect
          closeAfterSelect={false}
          title="Display sections"
          onSelect={this.onSelect}
          selections={this.choices}
        />
      </div>
    );
  }

};
