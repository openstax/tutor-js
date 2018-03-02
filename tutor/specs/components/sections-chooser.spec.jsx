import { SnapShot } from './helpers/component-testing';
import Factory, { FactoryBot } from '../factories';
import Chooser from '../../src/components/sections-chooser';

describe('Sections Chooser', () => {
  let book, props;

  beforeEach(() => {
    book = Factory.book();
    props = {
      book,
      onSelectionChange: jest.fn(),
      selectedPageIds: [],
    };
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<Chooser {...props} />).toJSON()).toMatchSnapshot();
  });

  it('can select', () => {
    const chooser = mount(<Chooser {...props} />);
    chooser.find('.chapter-heading .tutor-icon').at(1).simulate('click');
    const pageIds = book.children[1].children.map(pg => pg.id);
    expect(props.onSelectionChange).toHaveBeenCalledWith(pageIds);
    props.onSelectionChange.mockReset();
    const pageId = book.pages.byId.keys()[8];
    chooser.find(`[data-page-id="${pageId}"]`).simulate('click');
    expect(props.onSelectionChange).toHaveBeenCalledWith(pageIds.concat(pageId));
  });

});
