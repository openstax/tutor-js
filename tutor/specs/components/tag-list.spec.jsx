import TagList from '../../src/components/tag-list';

const ITEMS = [
  { id: 'a', title: 'Title A' },
  { id: 'b', title: 'Title B' },
  { id: 'c', title: 'Title C' },
];

describe('TagList component', () => {
  let props;

  beforeEach(() => {
    props = {
      items: ITEMS,
      onRemove: jest.fn(),
    };
  });

  it('renders items', () => {
    expect.snapshot(<TagList {...props} />).toMatchSnapshot();
  });

  it('fires callback when removed', () => {
    const list = mount(<TagList {...props} />);
    list.find('.remove-tag').at(3).simulate('click');
    expect(props.onRemove).toHaveBeenCalledWith(ITEMS[1]);
    list.unmount();
  });
});
