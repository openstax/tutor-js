import SummaryPage from '../../../src/components/notes/summary-page';
import { Factory } from '../../helpers';

// import Notes from


describe('Notes Summary Page', () => {
  let pages;
  let props;

  beforeEach(() => {
    const course = Factory.course();
    const note = Factory.note();
    course.notes.forChapterSection(
      note.chapter_section.chapter,
      note.chapter_section.section,
    ).onLoaded({ data: [note] });
    pages = [Factory.page()];
    course.notes.onHighlightedSectionsLoaded({
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

  it('renders selector', () => {
    const sp = mount(
      <SummaryPage {...props} />
    );
    expect(sp).toHaveRendered('DropdownToggle');
    sp.find('DropdownToggle Button').simulate('click');
    const dropDownSelector = `DropdownItem[eventKey="${pages[0].chapter_section.key}"]`;
    expect(sp).toHaveRendered(dropDownSelector);
    sp.find(dropDownSelector).simulate('click');
  });
});
