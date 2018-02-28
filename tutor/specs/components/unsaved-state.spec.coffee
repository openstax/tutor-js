{Testing, _, React} = require './helpers/component-testing'

{UnsavedStateMixin, TransitionAssistant} = require '../../src/components/unsaved-state'



describe 'Unsaved State Mixin', ->
  checks = null
  DirtyComponent = null
  CleanComponent = null
  Definition =
    mixins: [UnsavedStateMixin]
    render: -> return null

  beforeEach ->
    checks =
      dirty: jest.fn().mockReturnValue(true)
      clean: jest.fn().mockReturnValue(false)

    DirtyComponent = React.createClass(_.extend(Definition,
      displayName: 'DirtyComponent', hasUnsavedState: checks.dirty))
    CleanComponent = React.createClass(_.extend(Definition,
      displayName: 'CleanComponent', hasUnsavedState: checks.clean))

  it 'checks component to see if it has unsaved data', ->
    expect(TransitionAssistant.canTransition()).to.be.true

    Testing.renderComponent( DirtyComponent, {} ).then ({element}) =>
      expect(checks.dirty).not.toHaveBeenCalled()
      expect(TransitionAssistant.canTransition()).toEqual(false)
      expect(checks.dirty).toHaveBeenCalled()
      element.componentWillUnmount() # force cleanup

  xit 'checks that a clean component transistions', ->
    Testing.renderComponent( CleanComponent, {} ).then =>
      expect(TransitionAssistant.canTransition()).toEqual(true)
      expect(checks.clean).toHaveBeenCalled()

  xit 'generates an appropriate message', ->
    Testing.renderComponent( DirtyComponent, {} ).then ->
      expect(TransitionAssistant.unsavedMessages()).to.include('DirtyComponent has unsaved data')

  xit 'allows the componet to customize the message', ->
    MyComponent = React.createClass(_.extend(Definition,
      unsavedStateMessages: -> 'Better check the date fool'
      displayName: 'MyComponent', hasUnsavedState: checks.dirty))
    Testing.renderComponent( MyComponent, {} ).then ->
      expect(TransitionAssistant.unsavedMessages()).to.include('Better check the date fool')
