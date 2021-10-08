import Renderer from 'react-test-renderer';
import Factory from '../../factories';
import CnxMod from '../../../src/components/tags/cnx-mod';


describe('CNX mod tags component', function() {
    let props;

    beforeEach(() => {
        props = {
            exercise: Factory.exercise({
                tags: [
                    'context-cnxmod:80d2e9ef-abee-40c2-8586-5459a67c81f3',
                ],
            }),
        };
    });


    it('renders mod tags', () => {
        props.exercise.tags.push(
            'context-cnxmod:cb7cf05b-7e16-4a53-a498-003b01ec3d7f'
        );
        const modules = Renderer.create(<CnxMod {...props} />);
        expect(modules.toJSON()).toMatchSnapshot();
        modules.unmount();
    });

    it('can edit', () => {
        const modules = mount(<CnxMod {...props} />);
        const input = modules.find('input.form-control');
        input.simulate('change', { target: { value: 'one-two-three' } });
        input.simulate('blur');
        expect(modules).toHaveRendered('.has-error');

        expect(modules.find('TagError').props().error)
            .toContain('Must be the UUID of a module in the book (with hyphens)');
        const uuid = 'cb7cf05b-7e16-4a53-a498-003b01ec3d7f';

        input.simulate('change', { target: { value: uuid } });
        input.simulate('blur');
        expect(modules).not.toHaveRendered('.has-error');
        expect(props.exercise.tags.withType('context-cnxmod').value)
            .toEqual(uuid);

        modules.unmount();
    });

    it('can delete', () => {
        const { exercise } = props;
        expect(exercise.tags.length).toEqual(1);
        const modules = mount(<CnxMod {...props} />);
        modules.find('Input .controls Icon[type="trash"]').simulate('click');
        expect(exercise.tags.length).toEqual(0);
        modules.unmount();
    });

});
