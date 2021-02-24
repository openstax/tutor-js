import { ld } from '../helpers';
import createReactClass from 'create-react-class';
import { UnsavedStateMixin, TransitionAssistant } from '../../src/components/unsaved-state';


describe('Unsaved State Mixin', function() {
    let checks = null;
    let DirtyComponent = null;
    let CleanComponent = null;
    const Definition = {
        mixins: [UnsavedStateMixin],
        render() { return null; },
    };

    beforeEach(function() {
        checks = {
            dirty: jest.fn().mockReturnValue(true),
            clean: jest.fn().mockReturnValue(false),
        };

        DirtyComponent = createReactClass(ld.extend(Definition,
            { displayName: 'DirtyComponent', hasUnsavedState: checks.dirty }));
        CleanComponent = createReactClass(ld.extend(Definition,
            { displayName: 'CleanComponent', hasUnsavedState: checks.clean }));
    });

    it('checks component to see if it has unsaved data', function() {
        expect(TransitionAssistant.canTransition()).toBe(true);
        const c = mount(<DirtyComponent />);
        expect(checks.dirty).not.toHaveBeenCalled();
        expect(TransitionAssistant.canTransition()).toEqual(false);
        expect(checks.dirty).toHaveBeenCalled();
        c.unmount();
    });

    it('checks that a clean component transistions', () => {
        const c = mount(<CleanComponent />);
        expect(TransitionAssistant.canTransition()).toEqual(true);
        expect(checks.clean).toHaveBeenCalled();
        c.unmount();
    });

});
