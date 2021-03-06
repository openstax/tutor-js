import { React, PropTypes, observer, action, observable, modelize } from 'vendor';
import { Button } from 'react-bootstrap';
import { Icon } from 'shared';
import PopoutWindow from 'shared/components/popout-window';
import { ArbitraryHtmlAndMath } from 'shared';
import Analytics from '../../helpers/analytics';
import BookPartTitle from '../book-part-title';


const NotesForPage = observer(({
    notes, page, selectedPages,
}) => {
    if (!selectedPages.find(pg => pg.uuid == page.uuid)) {
        return null;
    }
    const pageNotes = notes.forPage(page);

    return (
        <div className="section">
            <BookPartTitle style={{ fontSize: '150%', marginBottom: '1rem' }} part={page} displayChapterSection />
            {pageNotes.byPagePosition.map((note) => (
                <div
                    key={note.id}
                    style={{
                        marginBottom: '2rem',
                    }}
                >
                    <blockquote
                        style={{
                            fontStyle: 'italic',
                            margin: '0 0 1rem 0.5rem',
                            borderLeft: '2px solid lightgrey',
                            paddingLeft: '0.5rem',
                        }}
                    >
                        <ArbitraryHtmlAndMath html={note.content} />
                    </blockquote>
                    <p
                        style={{
                            marginLeft: '0.5rem',
                        }}
                    >
                        {note.annotation}
                    </p>
                </div>
            ))}
        </div>
    );
});
NotesForPage.displayName = 'NotesForPage';

@observer
export default
class SummaryPopup extends React.Component {
    static propTypes = {
        windowImpl: PropTypes.shape({
            open: PropTypes.func,
        }),
        selected: PropTypes.array.isRequired,
        notes: PropTypes.object.isRequired,
    };

    @observable isOpen = false;

    static defaultProps = {
        windowImpl: window,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    componentDidMount() {
        Analytics.sendPageView('/notes/print');
    }

    @action.bound onSummaryWindowClose() {
        this.isOpen = false;
    }

    @action.bound openSummaryWindow() {
        this.isOpen = true;
        this.popup.open();
    }

    @action.bound onPopupReady(popup) {
        this.popup = popup;
        // give math a bit of time to render
        setTimeout(() => this.popup.print(), 100);
    }

    render() {
        const { notes, selected } = this.props;

        if (!notes) { return null; }

        const { course } = notes;

        return (
            <div>
                <Button
                    className="print-btn"
                    variant="link"
                    className="modal-action"
                    onClick={this.openSummaryWindow}
                >
                    <Icon type="print"/>
                </Button>
                <PopoutWindow
                    title={`${course.name} highlights and notes`}
                    onReady={this.onPopupReady}
                    ref={pw => (this.popup = pw)}
                    windowImpl={this.props.windowImpl}
                    onClose={this.onSummaryWindowClose}
                    options={{
                        height: 500,
                        width: 700,
                    }}
                >
                    <div className="summary-preview summary-popup">
                        <div className="notes">
                            {notes.summary.sorted().map((pg, i) =>
                                <NotesForPage
                                    key={i}
                                    notes={notes}
                                    selectedPages={selected}
                                    page={pg}
                                />)}
                        </div>
                    </div>
                </PopoutWindow>
            </div>
        );
    }
}
