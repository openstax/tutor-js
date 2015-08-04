{Testing, sinon, expect, _, React} = require './helpers/component-testing'

{UnsavedStateMixin, TransitionAssistant} = require '../../src/components/unsaved-state-mixin'


DirtyComponent = null
CleanComponent = null

describe 'Unsaved State Mixin', ->

  beforeEach ->
    @dirtyCheck = sinon.stub().returns(true)
    @cleanCheck = sinon.stub().returns(false)
    Definition =
      displayName: 'TestComponent'
      mixins: [UnsavedStateMixin]
      render: -> return null

    DirtyComponent = React.createClass(_.extend(Definition, hasUnsavedState: @dirtyCheck))
    CleanComponent = React.createClass(_.extend(Definition, hasUnsavedState: @cleanCheck))

  it 'checks component to see if it has unsaved data', ->
    expect(TransitionAssistant.canTransition()).to.be.true

    Testing.renderComponent( DirtyComponent, {} ).then =>
      expect(@dirtyCheck).not.to.have.been.called
      expect(TransitionAssistant.canTransition()).to.be.false
      expect(@dirtyCheck).to.have.been.called

    # Testing.renderComponent( CleanComponent, {} ).then =>
    #   console.log 'inside c res'
    #   expect(TransitionAssistant.canTransition()).to.be.true
    #   expect(@cleanCheck).to.have.been.called


  # it 'generates an appropriate message', ->
  #   Testing.renderComponent( DirtyComponent, {} ).then ->
  #     expect(TransitionAssistant.unsavedMessages()).to.include('foo')
