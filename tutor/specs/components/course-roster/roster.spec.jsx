import { React, Wrapper } from '../helpers/component-testing';
import Renderer from 'react-test-renderer';
import { Roster, courseRosterBootstrap } from './bootstrap-data';

describe('Course Settings', function() {

  let props;

  beforeEach(function() {
    props = courseRosterBootstrap();
  });

  it('renders period panels', () => {
    const wrapper = mount(<Roster {...props} />);
    const iterable = ['1st', '2nd', '3rd', '5th', '6th', '10th'];
    for (let i = 0; i < iterable.length; i++) {
      const period = iterable[i];
      expect(wrapper.find('.periods .nav-tabs li').at(i).text())
        .to.equal(period);
    }
    wrapper.unmount();
  });

  it('renders students in the panels', function() {
    const wrapper = mount(<Roster {...props} />);
    const iterable = ['Angstrom', 'Glass', 'Hackett', 'Jaskolski', 'Lowe', 'Tromp'];
    for (let i = 0; i < iterable.length; i++) {
      const name = iterable[i];
      expect(wrapper.find('.roster.students tbody tr').at(i).find('td').at(1).text())
        .to.equal(name);
    }
    wrapper.unmount();

  });

  it('switches roster when tab is clicked', function() {
    const wrapper = mount(<Roster {...props} />);
    const tab = wrapper.find('.periods .nav-tabs li').at(1).find('h2');
    tab.simulate('click');
    expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
      .to.equal('Bloom');
    expect(wrapper.find('.roster tbody tr').at(1).find('td').at(1).text())
      .to.equal('Kirlin');
  });

});
