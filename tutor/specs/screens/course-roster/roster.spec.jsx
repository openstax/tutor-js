import { R } from '../../helpers';
import { Roster, courseRosterBootstrap } from './bootstrap-data';

describe('Course Settings', function() {

    let props;

    beforeEach(function() {
        props = courseRosterBootstrap();
    });

    it('renders period panels', () => {
        const wrapper = mount(<R><Roster {...props} /></R>);
        const iterable = ['1st', '2nd', '3rd', '5th', '6th', '10th'];
        for (let i = 0; i < iterable.length; i++) {
            const period = iterable[i];
            expect(wrapper.find('.periods .nav-tabs li').at(i).text())
                .toEqual(period);
        }
        wrapper.unmount();
    });

    it('renders students in the panels', function() {
        const wrapper = mount(<R><Roster {...props} /></R>);
        const iterable = ['Angstrom', 'Glass', 'Hackett', 'Jaskolski', 'Lowe', 'Tromp'];
        for (let i = 0; i < iterable.length; i++) {
            const name = iterable[i];
            expect(wrapper.find('.roster.students tbody tr').at(i).find('td').at(1).text())
                .toEqual(name);
        }
        wrapper.unmount();

    });

    it('switches roster when tab is clicked', function() {
        const wrapper = mount(<R><Roster {...props} /></R>);
        const tab = wrapper.find('.periods .nav-tabs li').at(1).find('h2');
        tab.simulate('click');
        expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
            .toEqual('Bloom');
        expect(wrapper.find('.roster tbody tr').at(1).find('td').at(1).text())
            .toEqual('Kirlin');
    });

});
