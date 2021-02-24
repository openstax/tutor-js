import Name from '../../src/components/name';

describe('Name Component', function() {
    let props = {};
    beforeEach(() =>
        props = {
            name: 'Prince Humperdinck',
            first_name: 'Vincent',
            last_name: 'Adultman',
            tooltip: { enable: false },
        });

    it('renders using name if present and ignores first and last name', () => {
        const name = mount(<Name {...props} />);
        expect(name.text()).toContain('Prince Humperdinck');
    });

    describe('when missing name', function() {
        it('doesn\'t use a undefined name', function() {
            delete props.name;
            const name = mount(<Name {...props} />);
            expect(name.text()).toContain('Vincent Adultman');
        });

        it('doesn\'t use a null name', function() {
            props.name = null;
            const name = mount(<Name {...props} />);
            expect(name.text()).toContain('Vincent Adultman');
        });

        it('doesn\'t use an empty name', function() {
            props.name = '';
            const name = mount(<Name {...props} />);
            expect(name.text()).toContain('Vincent Adultman');
        });
    });
});
