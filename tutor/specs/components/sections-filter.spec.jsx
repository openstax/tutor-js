import renderer from 'react-test-renderer';
import { Factory } from '../helpers';
import { observable } from 'mobx';
import SectionsFilter from '../../src/components/notes/sections-filter';

describe('SectionsFilter component', () => {
  let props;

  beforeEach(() => {
    const course = Factory.course();
    const note = Factory.note();
    const pageNotes = course.notes.forPage({ id: note.page_id });

    pageNotes.onLoaded({ data: [note] });
    const pages = observable([Factory.page(), Factory.page(), Factory.page()]);

    course.notes.onHighlightedPagesLoaded({
      data: {
        pages,
      },
    });

    props = {
      notes: course.notes,
      selected: pages,
    };
  });

  it('renders', () => {
    expect.snapshot(<SectionsFilter {...props} />).toMatchSnapshot();
  });

  it('selects all when using the helper control', function() {
    const menu = mount(<SectionsFilter {...props} />);
    menu.find('button.dropdown-toggle').simulate('click');
    menu.find('a.select-all').simulate('click');
    expect(menu.find('[variant="checkedSquare"]')).toHaveLength(3);
    expect(menu.find('[variant="checkSquare"]')).toHaveLength(0);
    menu.unmount();
  });

  it('deselects all when using the helper control', function() {
      const menu = mount(<SectionsFilter {...props} />);
      menu.find('button.dropdown-toggle').simulate('click');
      menu.find('a.select-none').simulate('click');
      expect(menu.find('[variant="checkSquare"]')).toHaveLength(3);
      expect(menu.find('[variant="checkedSquare"]')).toHaveLength(0);
      menu.unmount();
    });
});
