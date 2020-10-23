import NoteCard from '../../../src/components/notes/note-card';
import { Factory } from '../../helpers';

jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Notes Summary Page', () => {
  let note;
  let props;
  let course;

  beforeEach(() => {
    course = Factory.course();
    note = Factory.note({}, { notes: { course } } );
    props = {
      note,
      onDelete: jest.fn(),
    };
  });

  it('matches snapshot', () => {
    const nc = mount(<NoteCard {...props} />);
    expect.snapshot(nc.debug()).toMatchSnapshot();
    nc.unmount();
  });

  it('renders with link', () => {
    const nc = mount(<NoteCard {...props} />);
    expect(nc).toHaveRendered(`a[target="_blank"][href="/book/${course.ecosystem_id}/page/${note.page_id}?highlight=${note.id}"]`);
    nc.unmount();
  });

});
