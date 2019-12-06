import PropTypes from 'prop-types';
import React from 'react';
import ChapterSection from '../chapter-section';
import Multiselect from '../multi-select';
import TagList from '../tag-list';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import styled from 'styled-components';

const WrappedChapterSection = styled(ChapterSection)`
  margin-right: 1rem;
  font-weight: normal;
`;

export default
@observer
class SectionsFilter extends React.Component {

  static propTypes = {
    notes: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    windowImpl: PropTypes.object,
  };

  @action.bound onSelect({ summary, selected } = {}) {
    const rec = this.props.selected.find(pg => pg.uuid == summary.uuid);
    if (selected) {
      this.props.selected.remove(rec);
    } else {
      if (!rec) {
        this.props.selected.push(summary);
        this.props.notes.ensurePageExists(summary);
      }
    }
  }

  @action.bound onSelectAll() {
    this.props.selected.clear();
    this.choices.forEach(c => {
      this.props.selected.push(c.summary);
      this.props.notes.ensurePageExists(c.summary);
    });
  }

  @action.bound onSelectNone() {
    this.props.selected.clear();
  }

  @action.bound onRemove(item) {
    this.onSelect({ summary: item, selected: true });
  }

  @computed get choices() {
    return this.props.notes.summary.sorted().map((s) => (
      {
        id: s.uuid,
        uuid: s.uuid,
        title: (
          <span>
            <WrappedChapterSection chapterSection={s.chapter_section} />
            {s.title}
          </span>
        ),
        summary: s,
        selected: !!this.props.selected.find(se => se.uuid == s.uuid),
      }
    ));
  }

  @computed get selectedChoices() {
    return this.choices.filter(c => c.selected);
  }

  @computed get useColumns() {
    return this.choices.length > 20;
  }

  render() {
    return (
      <div className="filter-widget">
        <Multiselect
          closeAfterSelect={false}
          showHelperControls={true}
          useColumns={this.useColumns}
          title="Sections"
          onSelect={this.onSelect}
          onSelectAll={this.onSelectAll}
          onSelectNone={this.onSelectNone}
          selections={this.choices}
        />
        <TagList
          onRemove={this.onRemove}
          onClearAll={this.onSelectNone}
          items={this.selectedChoices}
        />
      </div>
    );
  }

}
