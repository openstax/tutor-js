import renderer from 'react-test-renderer';
import MultiSelect from '../../src/components/multi-select';

const SELECTIONS = [
  { id: 't',  title: 'Turkey',           selected: true  },
  { id: 'h',  title: 'Ham',              selected: false },
  { id: 'p',  title: 'Potatoes & Gravy', selected: true  },
  { id: 'gb', title: 'Green Beans',      selected: false },
  { id: 'cb', title: 'Cranberries',      selected: false },
  { id: 'st', title: 'Stuffing',         selected: true  },
];

describe('MultiSelect component', () => {
  let props;

  beforeEach(() => {
    props = {
      id: 'foods',
      title: 'Food Selections',
      selections: SELECTIONS,
      onSelect: jest.fn(),
    };
  });

  it('renders selections', () => {
    const form = renderer.create(<MultiSelect {...props} />);
    expect(form.toJSON()).toMatchSnapshot();
  });

  it('fires callback when selected', async function() {
    const wrapper = mount(<MultiSelect {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('.dropdown button').simulate('click');
    expect(wrapper).toHaveRendered('.dropdown.open');
    wrapper.find('[role="menuitem"]').at(2).simulate('click');
    expect(props.onSelect).toHaveBeenCalledWith(SELECTIONS[2]);
    expect(wrapper).not.toHaveRendered('.dropdown.open');
  });

  it('remains open after selection if closeAfterSelect=false', function() {
    props.closeAfterSelect = false;
    const menu = mount(<MultiSelect {...props} />);
    expect(menu).not.toHaveRendered('.dropdown.open');
    menu.find('.dropdown button').simulate('click');
    expect(menu).toHaveRendered('.dropdown.open');
    menu.find('[role="menuitem"]').at(3).simulate('click');
    expect(props.onSelect).toHaveBeenCalledWith(SELECTIONS[3]);
    expect(menu).toHaveRendered('.dropdown.open');
  });

});
