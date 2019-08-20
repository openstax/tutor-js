import { Factory, C } from '../helpers';
import Chooser from '../../src/components/sections-chooser';

describe('Sections Chooser', () => {
  let book, props;

  beforeEach(() => {
    book = Factory.book();
    props = {
      book,
      course: Factory.course(),
      onSelectionChange: jest.fn(),
      selectedPageIds: [],
    };
  });

  fit('renders and matches snapshot', () => {
    expect.snapshot(<C><Chooser {...props} /></C>).toMatchSnapshot();
  });

  it('can select', () => {
    const chooser = mount(<C><Chooser {...props} /></C>);
    chooser.find('TriStateCheckbox Icon').at(1).simulate('click');
    const pageIds = book.children[1].children.map(pg => pg.id);
    expect(props.onSelectionChange).toHaveBeenCalledWith(pageIds);
    props.onSelectionChange.mockReset();
    const pageId = book.pages.byId.keys()[8];
    chooser.find(`[data-section-id="${pageId}"] input`).simulate('click');
    expect(props.onSelectionChange).toHaveBeenCalledWith(pageIds.concat(pageId));
  });

});
