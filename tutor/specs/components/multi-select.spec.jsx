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
    expect.snapshot(<MultiSelect {...props} />).toMatchSnapshot();
  });

  it('fires callback when selected', async function() {
    const wrapper = mount(<MultiSelect {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.find('button.dropdown-toggle').simulate('click');
    //    console.log(wrapper.update().debug());
    expect(wrapper).toHaveRendered('div.multi-select.dropdown.show');
    wrapper.find('a.multi-selection-option').at(2).simulate('click');
    expect(props.onSelect).toHaveBeenCalledWith(SELECTIONS[2]);
    expect(wrapper).not.toHaveRendered('.dropdown.open');
    wrapper.unmount();
  });

  it('remains open after selection if closeAfterSelect=false', function() {
    props.closeAfterSelect = false;
    const menu = mount(<MultiSelect {...props} />);
    expect(menu).not.toHaveRendered('.dropdown.open');
    menu.find('button.dropdown-toggle').simulate('click');
    expect(menu).toHaveRendered('div.multi-select.dropdown.show');
    menu.find('a.multi-selection-option').at(3).simulate('click');
    expect(props.onSelect).toHaveBeenCalledWith(SELECTIONS[3]);
    expect(menu).toHaveRendered('.dropdown.show');
    menu.unmount();
  });

  it('renders helper controls if showHelperControls=true', function() {
    props.showHelperControls = true;
    const menu = mount(<MultiSelect {...props} />);
    menu.find('button.dropdown-toggle').simulate('click');
    expect(menu).toHaveRendered('div.multi-select-helpers');
    menu.unmount();
  });
});
