import SummaryPopup from '../../../src/components/notes/summary-popup';
import { Factory, ApiMock, runInAction } from '../../helpers';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

jest.mock('shared/components/popout-window', () => {
    const React = require('react');
    class MockPopout extends React.Component {
        print() {}
        open() {}
        render () {
            return <div data-mocked-popout>{this.props.children}</div>;
        }
    }
    return MockPopout;
});

describe('Notes Summary Popup', () => {
    let pages;
    let props;

    beforeEach(() => {
        const course = Factory.course();
        pages = [Factory.page()];
        const note = Factory.data('Note');

        ApiMock.intercept({
            'notes': [note],
        })

        runInAction(() => note.annotation = 'This is a comment added by user');
        const pageNotes = course.notes.ensurePageExists(pages[0]);
        pageNotes.onLoaded([note]);
        course.notes.onHighlightedPagesLoaded(pages);
        props = {
            page: pages[0],
            notes: course.notes,
            selected: pages,
        };
    });

    it('matches snapshot', () => {
        expect.snapshot(<SummaryPopup {...props} />).toMatchSnapshot();
    });

    it('renders summary and annotations', () => {
        const sp = mount(<SummaryPopup {...props} />);
        expect(sp).toHaveRendered('MockPopout NotesForPage');
        expect(sp.find('MockPopout NotesForPage').text()).toContain('added by user');
        sp.unmount();
    });
});
