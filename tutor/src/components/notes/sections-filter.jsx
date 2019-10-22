import PropTypes from 'prop-types';
import React from 'react';
import ChapterSection from '../chapter-section';
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

  @action.bound onSelect({ summary, selected } = {}) {
    const rec = this.props.selected.find(pg => pg.id == summary.id);
    if (selected) {
      this.props.selected.remove(rec);
    } else {
      if (!rec) {
        this.props.selected.push(summary);
      }
    }
  }

  @computed get choices() {
    return this.props.notes.summary.sorted().map((s) => (
      {
        id: s.id,
        title: (
          <span>
            <ChapterSection chapterSection={s.chapter_section} />
            <span>{s.title}</span>
          </span>
        ),
        summary: s,
        selected: !!this.props.selected.find(se => se.id == s.id),
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
