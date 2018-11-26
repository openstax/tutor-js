import PropTypes from 'prop-types';
import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import NotesMap from '../../models/notes';

export default
@observer
class NoteSummaryPage extends React.Component {

  static propTypes = {
    notes: PropTypes.instanceOf(NotesMap).isRequired,
    onDelete: PropTypes.func.isRequired,
    currentChapter: PropTypes.number.isRequired,
    currentSection: PropTypes.number.isRequired,
    courseId: PropTypes.string.isRequired,
  };

  @readonly selectedSections = observable.map();

  resetToSection(chapter, section) {
    this.selectedSections.clear();
    this.selectedSections.set(`${chapter}.${section}`, true);
  }

  componentWillMount() {
    this.resetToSection(this.props.currentChapter, this.props.currentSection);
  }

  componentDidMount() {
    this.prepareFocus();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentSection !== this.props.currentSection ||
        nextProps.currentChapter !== this.props.currentChapter
    ) {
      this.resetToSection(nextProps.currentChapter, nextProps.currentSection);
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

  @computed get notesBySection() {
    return this.props.notes.byCourseAndPage[this.props.courseId];
  }

  @computed get selectedNotes() {
    return pickBy(this.notesBySection, (notes, cs) => this.selectedSections.get(cs));
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
    if (isEmpty(this.selectedNotes)) {
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
    if (!keys(this.notesBySection).length) {
      return this.renderEmpty();
    }

    return (
      <div className="summary-page" ref={ref => this.containerRef = ref}>
        <h1>
          Highlights and notes
        </h1>
        <div className="filter-area">
          <SectionsFilter
            sections={this.notesBySection}
            selected={this.selectedSections}
          />
          <SummaryPopup notes={this.selectedNotes} courseId={this.props.courseId} />
        </div>
        {this.renderEmptyMessage()}
        <div className="notes">
          {map(this.selectedNotes, (notes, ch) =>
            <div key={ch} className="section">
              <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
              {map(notes, (note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={this.onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

};
