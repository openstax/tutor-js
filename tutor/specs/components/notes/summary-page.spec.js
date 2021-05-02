import SummaryPage from '../../../src/components/notes/summary-page';
import { Router, Factory, ApiMock } from '../../helpers';

describe('Notes Summary Page', () => {
    let pages;
    let props;

    ApiMock.intercept({
        'highlighted_sections': () => ({
            pages: [ pages[0] ],
        }),
    })

    beforeEach(() => {
        const course = Factory.course();
        pages = [Factory.page()];
        const note = Factory.note({}, { notes: { course } });
        course.notes.ensurePageExists(pages[0]).onLoaded([note]);
        course.notes.onHighlightedPagesLoaded(pages);
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
