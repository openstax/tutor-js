{Testing, sinon, expect, _, React} = require './helpers/component-testing'

{UnsavedStateMixin, TransitionAssistant} = require '../../src/components/unsaved-state-mixin'


DirtyComponent = null
CleanComponent = null
Definition =
  mixins: [UnsavedStateMixin]
  render: -> return null

describe 'Unsaved State Mixin', ->

  beforeEach ->
    @dirtyCheck = sinon.stub().returns(true)
    @cleanCheck = sinon.stub().returns(false)

    DirtyComponent = React.createClass(_.extend(Definition,
      displayName: 'DirtyComponent', hasUnsavedState: @dirtyCheck))
    CleanComponent = React.createClass(_.extend(Definition,
      displayName: 'CleanComponent', hasUnsavedState: @cleanCheck))

  it 'checks component to see if it has unsaved data', ->
    expect(TransitionAssistant.canTransition()).to.be.true

    Testing.renderComponent( DirtyComponent, {} ).then =>
      expect(@dirtyCheck).not.to.have.been.called
      expect(TransitionAssistant.canTransition()).to.be.false
      expect(@dirtyCheck).to.have.been.called

  it 'checks that a clean component transistions', ->
    Testing.renderComponent( CleanComponent, {} ).then =>
      expect(TransitionAssistant.canTransition()).to.be.true
      expect(@cleanCheck).to.have.been.called


  it 'generates an appropriate message', ->
    Testing.renderComponent( DirtyComponent, {} ).then ->
      expect(TransitionAssistant.unsavedMessages()).to.include('DirtyComponent has unsaved data')

  it 'allows the componet to customize the message', ->
    MyComponent = React.createClass(_.extend(Definition,
      unsavedStateMessages: -> 'Better check the date fool'
      displayName: 'MyComponent', hasUnsavedState: @dirtyCheck))
    Testing.renderComponent( MyComponent, {} ).then ->
      expect(TransitionAssistant.unsavedMessages()).to.include('Better check the date fool')
