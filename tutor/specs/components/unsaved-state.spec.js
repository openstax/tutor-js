import { Testing, _, React } from './helpers/component-testing';

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

    DirtyComponent = React.createClass(_.extend(Definition,
      { displayName: 'DirtyComponent', hasUnsavedState: checks.dirty }));
    return CleanComponent = React.createClass(_.extend(Definition,
      { displayName: 'CleanComponent', hasUnsavedState: checks.clean }));
  });

  it('checks component to see if it has unsaved data', function() {
    expect(TransitionAssistant.canTransition()).to.be.true;

    return Testing.renderComponent( DirtyComponent, {} ).then(({ element }) => {
      expect(checks.dirty).not.toHaveBeenCalled();
      expect(TransitionAssistant.canTransition()).toEqual(false);
      expect(checks.dirty).toHaveBeenCalled();
      return element.componentWillUnmount();
    });
  }); // force cleanup

  xit('checks that a clean component transistions', () =>
    Testing.renderComponent( CleanComponent, {} ).then(() => {
      expect(TransitionAssistant.canTransition()).toEqual(true);
      return expect(checks.clean).toHaveBeenCalled();
    })
  );

  xit('generates an appropriate message', () =>
    Testing.renderComponent( DirtyComponent, {} ).then(() => expect(TransitionAssistant.unsavedMessages()).to.include('DirtyComponent has unsaved data'))
  );

  return xit('allows the componet to customize the message', function() {
    const MyComponent = React.createClass(_.extend(
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
