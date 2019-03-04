import SummaryPopup from '../../../src/components/notes/summary-popup';
import { Factory } from '../../helpers';

describe('Notes Summary Popup', () => {
  let pages;
  let props;

  beforeEach(() => {
    const course = Factory.course();
    const note = Factory.note();
    course.notes.forChapterSection(note.chapter_section)
      .onLoaded({ data: [note] });
    pages = [Factory.page()];
    course.notes.onHighlightedSectionsLoaded({
      data: {
        pages,
      },
    });
    props = {
      page: pages[0],
      notes: course.notes,
      selected: [note.chapter_section],
    };
  });

  it('renders summary', () => {
    const sp = mount(
      <SummaryPopup {...props} />
    );
    expect(sp).toHaveRendered('PopoutWindow');
  });
});
