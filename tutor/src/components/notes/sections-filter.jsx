import PropTypes from 'prop-types';
import React from 'react';
import Multiselect from '../multi-select';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

export default
@observer
class SectionsFilter extends React.Component {

  static propTypes = {
    notes: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    windowImpl: PropTypes.object,
  };

  @action.bound onSelect({ id: key, selected } = {}) {

    if (selected) {
      this.props.selected.remove(key);
    } else {
      this.props.selected.push(key);
    }
  }

  @computed get choices() {
    return this.props.notes.summary.sorted().map((s) => (
      {
        id: s.chapter_section.key,
        title: (
          <span>
            <span className="section">{s.chapter_section.asString}</span>
            <span>{s.title}</span>
          </span>
        ),
        selected: this.props.selected.includes(s.chapter_section.key),
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

}
