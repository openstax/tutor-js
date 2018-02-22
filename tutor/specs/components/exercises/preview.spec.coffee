{Testing, _, ReactTestUtils} = require '../helpers/component-testing'

ExercisePreviewWrapper = require '../../../src/components/exercises/preview'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'

EXERCISES = require '../../../api/exercises'

describe 'Exercise Preview Wrapper Component', ->
  props = {}
  beforeEach ->
    props =
      exercise: EXERCISES.items[0]
      onShowDetailsViewClick: jest.fn()
      onExerciseToggle:       jest.fn()
      getExerciseIsSelected:  jest.fn()
      getExerciseActions:     jest.fn().mockReturnValue({})
      watchStore: ExerciseStore
      watchEvent: 'testing-'

  it 'renders', ->
    Testing.renderComponent( ExercisePreviewWrapper, props: props ).then ({dom}) ->
      expect( dom ).to.exist
      expect(dom.textContent).to.include('aims and topics of natural philosophy')

  it 'listens for store updates', ->
    Testing.renderComponent( ExercisePreviewWrapper, props: props ).then ({dom}) =>
      expect(props.getExerciseActions).toHaveBeenCalledTimes(1)
      ExerciseStore.emit("testing-#{props.exercise.id}")
      expect(props.getExerciseActions).toHaveBeenCalledTimes(2)
