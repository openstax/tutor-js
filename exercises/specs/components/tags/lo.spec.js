import Factory from '../../factories';
import Lo from '../../../src/components/tags/lo';


describe('Lo tags component', () => {
    let props;
    beforeEach(() => {
        props = {
            exercise: Factory.exercise({ tags: ['book:stax-phys'] }),
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<Lo {...props} />).toMatchSnapshot();
    });

    it('validates most books with default settings', () => {
        const lo = mount(<Lo {...props} />);
        lo.find('Icon[type="plus-circle"] button').simulate('click');
        lo.find('BookSelection select').simulate('change', {
            target: { value: 'stax-apphys' },
        });
        const input = lo.find('Input input[type="text"]');
        expect(input.props()).toMatchObject({
            placeholder: '##-##-##',
        });
        input.simulate('change', { target: { value: 'INVALID!' } });
        input.simulate('blur');
        expect(lo).toHaveRendered('TagError');
        expect(lo.find('TagError').props()).toMatchObject({
            error: expect.stringContaining('Must have book and match LO pattern'),
        });

        input.simulate('change', { target: { value: '12-11-42' } });
        input.simulate('blur');
        expect(lo.find('TagError').props().error).toBeUndefined();

        lo.unmount();
    });

    it('validates stax-worldhist with custom settings', () => {
        const lo = mount(<Lo {...props} />);
        lo.find('Icon[type="plus-circle"] button').simulate('click');
        lo.find('BookSelection select').simulate('change', {
            target: { value: 'stax-worldhist' },
        });
        const input = lo.find('Input input[type="text"]');
        expect(input.props()).toMatchObject({
            placeholder: '[AB]##-##-##',
        });
        input.simulate('change', { target: { value: '12-11-42' } });
        input.simulate('blur');
        expect(lo).toHaveRendered('TagError');
        expect(lo.find('TagError').props()).toMatchObject({
            error: expect.stringContaining('Must have book and match LO pattern'),
        });

        input.simulate('change', { target: { value: 'A12-11-42' } });
        input.simulate('blur');
        expect(lo.find('TagError').props().error).toBeUndefined();

        lo.unmount();
    });

});
