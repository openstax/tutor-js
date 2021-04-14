import { React, PropTypes, readonly, observer, observable, action } from 'vendor';
import { isEmpty } from 'lodash';
import SectionsFilter from './sections-filter';
import NoteCard from './note-card';
import SummaryPopup from './summary-popup';
import { Notes, ReferenceBookNode } from '../../models';
import LoadingAnimation from 'shared/components/loading-animation';
import BookPartTitle from '../book-part-title';


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
                <BookPartTitle part={page} displayChapterSection />
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

@observer
export default
class NoteSummaryPage extends React.Component {

    static propTypes = {
        page: PropTypes.instanceOf(ReferenceBookNode).isRequired,
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
        this.props.notes.fetchHighlightedPages()
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
        if (note.page.isEmpty) {
            this.selectedPages.remove(
                this.selectedPages.find(s => s.uuid == note.page.uuid)
            );
        }
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
                    <p className="no-highlights">You have no highlights in this section.</p>
                    <div className="blank-slate-wrapper">
                        <h3 className="blank-slate-title">To make a highlight and add a note</h3>
                        <div className="blank-slate-inner">
                            <div className="blank-slate-step">
                                <span><strong>1.</strong> Click and drag to select the text you want to highlight.</span>
                            </div>
                            <div className="blank-slate-step">
                                <span><strong>2.</strong> A panel <span className="panel-icon"></span> will pop up.</span>
                            </div>
                            <div className="blank-slate-step">
                                <span><strong>3.</strong> Click on the ‘Highlighter’ icon <span className="highlighter-icon"></span> to make a highlight.</span>
                            </div>
                            <div className="blank-slate-step blank-slate-step-skip">
                OR
                            </div>
                            <div className="blank-slate-step">
                                <span><strong>4.</strong> Click on the ‘Notes’ icon <span className="notes-icon"></span> to add a note with your highlight.</span>
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
