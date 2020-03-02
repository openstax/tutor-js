import { Factory, C } from '../helpers';
import Chooser from '../../src/components/sections-chooser';

describe('Sections Chooser', () => {
  let book, props;

  beforeEach(() => {
    book = Factory.book({ type: 'physics' });
    props = {
      book,
      course: Factory.course(),
      onSelectionChange: jest.fn(),
      selectedPageIds: [],
    };
  });

  it('can select', () => {
    const chooser = mount(<C><Chooser {...props} /></C>);
    chooser.find('TriStateCheckbox Icon').at(1).simulate('click');
    expect(props.onSelectionChange).toHaveBeenCalled();
    props.onSelectionChange.mockReset();
    const pageId = book.pages.byId.keys()[8];
    chooser.find(`[data-section-id="${pageId}"] input`).simulate('click');
    expect(props.onSelectionChange).toHaveBeenCalledWith(
      expect.arrayContaining([pageId])
    );
  });

});
