import SummaryPage from '../../../src/components/notes/summary-page';
import { Router, Factory } from '../../helpers';

describe('Notes Summary Page', () => {
    let pages;
    let props;

    beforeEach(() => {
        const course = Factory.course();
        const note = Factory.note();
        pages = [Factory.page()];
        course.notes.ensurePageExists(pages[0]).onLoaded({ data: [note] });
        course.notes.onHighlightedPagesLoaded({
            data: {
                pages,
            },
        });
        props = {
            page: pages[0],
            notes: course.notes,
            onDelete: jest.fn(),
        };
    });

    it('renders summary', () => {
        const sp = mount(
            <Router><SummaryPage {...props} /></Router>
        );
        expect(sp).toHaveRendered('DropdownToggle');
        sp.find('DropdownToggle Button').simulate('click');
        const dropDownSelector = `DropdownItem[eventKey="${pages[0].uuid}"]`;
        expect(sp).toHaveRendered(dropDownSelector);
        sp.find(dropDownSelector).simulate('click');
        sp.unmount();
    });
});
