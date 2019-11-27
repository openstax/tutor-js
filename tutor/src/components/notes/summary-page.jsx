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
        <div>
          <p>You have no highlights in this section.</p>
          <div className="blank-slate-wrapper">
            <h4 className="blank-slate-title">To make a highlight and add a note</h4>
            <div className="blank-slate-instructions">
              <div className="items">
                <div className="item">Click and drag to select the text you want to highlight.</div>
                <div className="item">A panel will pop up.</div>
                <div className="item">Click on the ‘Highlighter’ icon to make a highlight.</div>
                <div className="item" className="divider">OR</div>
                <div className="item">Click on the ‘Notes’ icon to add a note with your highlight.</div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!this.selectedPages.length) {
      notesBody = (
        <div className="blank-slate-wrapper">
          <p>Please select filters to view your highlights</p>
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
