import { React, PropTypes, readonly, observer, observable, action } from 'vendor';
import { isEmpty } from 'lodash';
import ChapterSection from '../chapter-section';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import { Notes } from '../../models/notes';
import Page from '../../models/reference-book/page';

const NotesForPage = observer(({
  onDelete, notes, page, selectedPages,
}) => {
  if (!selectedPages.find(pg => pg.id == page.id)) {
    return null;
  }
  const pageNotes = notes.forPage(page);

  return (
    <div className="section">
      <h2 className="section-title">
        <ChapterSection chapterSection={page.chapter_section} />
        {page.title }
      </h2>
      {pageNotes.byPagePosition.map((note) => (
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

  @readonly selectedPages = observable.array();

  resetCurrentPage() {
    this.selectedPages.clear();
    if (this.props.notes.forPage(this.props.page)) {
      this.selectedPages.push(this.props.page);
    }
  }

  componentDidMount() {
    this.resetCurrentPage();
    this.prepareFocus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page) {
      this.resetCurrentPage();
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
      !this.selectedPages.length &&
        !notes.summary.find(s => s.id == page.id)
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
    if (isEmpty(this.props.notes.summary)) {
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
            selected={this.selectedPages}
          />
          <SummaryPopup
            notes={notes}
            selected={this.selectedPages}
          />
        </div>
        {this.renderEmptyMessage()}
        <div className="notes">
          {notes.summary.sorted().map((p, i) =>
            <NotesForPage
              key={i}
              notes={notes}
              selectedPages={this.selectedPages}
              page={p}
              onDelete={this.onDelete}
            />)}
        </div>
      </div>
    );
  }

}
