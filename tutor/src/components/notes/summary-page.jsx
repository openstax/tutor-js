import { React, PropTypes, readonly, observer, observable, action } from 'vendor';
import { isEmpty } from 'lodash';
import ChapterSection from '../chapter-section';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import { Notes } from '../../models/notes';
import Page from '../../models/reference-book/page';
import LoadingAnimation from 'shared/components/loading-animation';

const NotesForPage = observer(({
  onDelete, notes, page, selectedPages,
}) => {
  const pg = selectedPages.find(pg => pg.uuid == page.uuid);
  if (!pg) {
    return null;
  }
  const pageNotes = notes.forPage(pg);

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

NotesForPage.displayName = 'NotesForPage';

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
    this.props.notes.ensurePageExists(this.props.page);
    const summary = this.props.notes.summary.forPage(this.props.page);
    if (summary) {
      this.selectedPages.push(summary);
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

  render() {
    const { notes } = this.props;

    let notesBody;

    if (notes.isAnyPagePending) {
      notesBody = <LoadingAnimation />;
    } else if (isEmpty(notes.summary)) {
      notesBody = (
        <h4>
          Here’s where you will see a summary of your highlights and notes.
        </h4>
      );
    } else if (!this.selectedPages.length) {

      notesBody = (
        <div className="notes">
          <h3>This page has no notes</h3>
          <p>Select a section from the picker above to display it’s notes</p>
        </div>
      );

    } else {
      notesBody = notes.summary.sorted().map((p, i) =>
        <NotesForPage
          key={i}
          notes={notes}
          selectedPages={this.selectedPages}
          page={p}
          onDelete={this.onDelete}
        />
      );
    }

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
        <div className="notes">
          {notesBody}
        </div>
      </div>
    );
  }

}
