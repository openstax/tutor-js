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
    return CleanComponent = createReactClass(ld.extend(Definition,
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

  xit('generates an appropriate message', () =>
    Testing.renderComponent( DirtyComponent, {} ).then(() => expect(TransitionAssistant.unsavedMessages()).to.include('DirtyComponent has unsaved data'))
  );

  return xit('allows the componet to customize the message', function() {
    const MyComponent = React.createClass(ld.extend(
      Definition,
      {
        unsavedStateMessages() { return 'Better check the date fool'; },
        displayName: 'MyComponent',
        hasUnsavedState: checks.dirty,
      },
    ));
    return Testing.renderComponent( MyComponent, {} ).then(() => expect(TransitionAssistant.unsavedMessages()).to.include('Better check the date fool'));
  });
});
