import SummaryPopup from '../../../src/components/notes/summary-popup';
import { Factory } from '../../helpers';

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
    const note = Factory.note();
    note.annotation = 'This is a comment added by user';
    const pageNotes = course.notes.forChapterSection(note.chapter_section);
    pageNotes.onLoaded({ data: [note] });
    pages = [Factory.page({ chapter_section: note.chapter_section.asString } )];
    course.notes.onHighlightedSectionsLoaded({
      data: {
        pages,
      },
    });
    props = {
      page: pages[0],
      notes: course.notes,
      selected: [note.chapter_section.key],
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<SummaryPopup {...props} />).toMatchSnapshot();
  });

  it('renders summary and annotations', () => {
    const sp = mount(<SummaryPopup {...props} />);
    expect(sp).toHaveRendered('MockPopout NotesForSection');
    expect(sp.find('MockPopout NotesForSection').text()).toContain('added by user');
  });
});
