import PropTypes from 'prop-types';
import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import { Notes } from '../../models/notes';
import Page from '../../models/reference-book/page';
import ChapterSection from '../../models/chapter-section';

const NotesForSection = observer(({ onDelete, notes, chapterSection }) => {
  const sel = notes.find(chapterSection);
  if (!sel.section) { return null; }

  return (
    <div className="section">
      <h2>{sel.section.chapter_section.asString} {sel.section.title}</h2>
      {sel.notes.array.map((note) => (
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
    // currentChapter: PropTypes.number.isRequired,
    // currentSection: PropTypes.number.isRequired,
  };

  @readonly selectedSections = observable.array();

  resetCurrentChapterSection() {
    this.selectedSections.clear();
    if (this.props.notes.find(this.currentChapterSection.key)) {
      this.selectedSections.push(this.currentChapterSection.key);
    }
  }

  componentWillMount() {
    this.resetCurrentChapterSection();
  }

  @computed get currentChapterSection() {
    return this.props.page.chapter_section;
  }

  componentDidMount() {
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

  @action.bound onDelete(...args) {
    this.props.onDelete(...args);
    this.prepareFocus();
  }

  // @computed get sectionsWithNotes() {
  //   const sections = [];
  //   this.selectedSections.forEach((cs) => {
  //     const section = notes.find(chapterSection);
  //
  //   })
  //  //   sections.push(
  //    //   return this.props.notes.sections;
  //   //    return this.props.notes.byCourseAndPage[this.props.courseId];
  // }

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
          {this.selectedSections.slice().sort().map((cs, i) =>
            <NotesForSection
              key={i}
              notes={notes}
              chapterSection={cs}
              onDelete={this.onDelete}
            />)}
        </div>
      </div>
    );
  }

};
