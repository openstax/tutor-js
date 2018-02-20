{Testing, _, ReactTestUtils} = require '../helpers/component-testing'

Cards = require '../../../src/components/exercises/cards'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'

FakeWindow = require 'shared/specs/helpers/fake-window'


EXERCISES = require '../../../api/exercises'
ECOSYSTEM_ID = '1'

describe 'Exercise Cards Component', ->
  props = {}
  beforeEach ->
    props =
      ecosystemId: ECOSYSTEM_ID
      exercises: {grouped: { '1.1': EXERCISES.items} }
      onExerciseToggle:       jest.fn()
      getExerciseIsSelected:  jest.fn().mockReturnValue(false)
      getExerciseActions:     jest.fn().mockReturnValue({})
      onShowDetailsViewClick: jest.fn()
      windowImpl: new FakeWindow
      watchStore: ExerciseStore
      watchEvent: 'testing-'

  it 'scrolls to exercse id on mount', ->
    props.focusedExerciseId = EXERCISES.items[0].id
    Testing.renderComponent( Cards, props: props ).then ({element}) =>
      expect(props.windowImpl.scroll).toHaveBeenCalled()
