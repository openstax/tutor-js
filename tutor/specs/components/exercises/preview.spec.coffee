{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

ExercisePreviewWrapper = require '../../../src/components/exercises/preview'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'

EXERCISES = require '../../../api/exercises'

describe 'Exercise Preview Wrapper Component', ->


  beforeEach ->
    @props =
      exercise: EXERCISES.items[0]
      onShowDetailsViewClick: sinon.spy()
      onExerciseToggle:       sinon.spy()
      getExerciseIsSelected:  sinon.spy()
      getExerciseActions:     sinon.stub().returns({})
      watchStore: ExerciseStore
      watchEvent: 'testing-'

  it 'renders', ->
    Testing.renderComponent( ExercisePreviewWrapper, props: @props ).then ({dom}) ->
      expect( dom ).to.exist
      expect(dom.textContent).to.include('aims and topics of natural philosophy')

  it 'listens for store updates', ->
    Testing.renderComponent( ExercisePreviewWrapper, props: @props ).then ({dom}) =>
      expect(@props.getExerciseActions.callCount).equal(1)
      ExerciseStore.emit("testing-#{@props.exercise.id}")
      expect(@props.getExerciseActions.callCount).equal(2)
