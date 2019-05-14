import PropTypes from 'prop-types';
import React from 'react';
import { readonly } from 'core-decorators';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import { Notes } from '../../models/notes';
import Page from '../../models/reference-book/page';

const NotesForSection = observer(({
  onDelete, notes, section, selectedSections,
}) => {
  if (!selectedSections.includes(section.chapter_section.key)) {
    return null;
  }
  const page = notes.forChapterSection(section.chapter_section);

  return (
    <div className="section">
      <h2 className="section-title">
        {section.chapter_section.asString}
        {section.title }
      </h2>
      {page.notesByPagePosition.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});


export default
@observer
class NoteSummaryPage extends React.Component {

  static propTypes = {
    page: PropTypes.instanceOf(Page).isRequired,
    notes: PropTypes.instanceOf(Notes).isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  @readonly selectedSections = observable.array();

  resetCurrentChapterSection() {
    this.selectedSections.clear();
    if (this.props.notes.find(this.currentChapterSection.key)) {
      this.selectedSections.push(this.currentChapterSection.key);
    }
  }

  @computed get currentChapterSection() {
    return this.props.page.chapter_section;
  }

  componentDidMount() {
    this.resetCurrentChapterSection();
    this.prepareFocus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page) {
      this.resetCurrentChapterSection();
    }
  }

  prepareFocus() {
    const { containerRef } = this;
    const focusAnchor = document.createElement('a');

    focusAnchor.setAttribute('href', '#');
    containerRef.insertBefore(focusAnchor, containerRef.firstChild);
    focusAnchor.focus();
    focusAnchor.addEventListener('blur', () => containerRef.removeChild(focusAnchor), false);
  }

  @action.bound onDelete(note) {
    this.props.onDelete(note);
    this.prepareFocus();
  }

  renderEmpty() {
    return (
      <div className="summary-page" ref={ref => this.containerRef = ref}>
        <div className="notes">
          <h1>
            Highlights and notes
          </h1>
          <h4>
            Here’s where you will see a summary of your highlights and notes.
          </h4>
        </div>
      </div>
    );
  }


  renderEmptyMessage() {
    const { notes, page } = this.props;

    if (
      !this.selectedSections.length &&
        !notes.sections.find(s => s.chapter_section.matches(page.chapter_section))
    ) {
      return (
        <div className="notes">
          <h3>This page has no notes</h3>
          <p>Select a section from the picker above to display it’s notes</p>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (isEmpty(this.props.notes.sections)) {
      return this.renderEmpty();
    }

    const { notes } = this.props;

    return (
      <div className="summary-page" ref={ref => this.containerRef = ref}>
        <h1>
          Highlights and notes
        </h1>
        <div className="filter-area">
          <SectionsFilter
            notes={notes}
            selected={this.selectedSections}
          />
          <SummaryPopup
            notes={notes}
            selected={this.selectedSections}
          />
        </div>
        {this.renderEmptyMessage()}
        <div className="notes">
          {notes.sections.sorted().map((s, i) =>
            <NotesForSection
              key={i}
              notes={notes}
              selectedSections={this.selectedSections}
              section={s}
              onDelete={this.onDelete}
            />)}
        </div>
      </div>
    );
  }

}
