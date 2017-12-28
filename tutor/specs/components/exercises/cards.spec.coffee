{Testing, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

Cards = require '../../../src/components/exercises/cards'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'

FakeWindow = require 'shared/specs/helpers/fake-window'


EXERCISES = require '../../../api/exercises'
ECOSYSTEM_ID = '1'

describe 'Exercise Cards Component', ->

  beforeEach ->

    @props =
      ecosystemId: ECOSYSTEM_ID
      exercises: {grouped: { '1.1': EXERCISES.items} }
      onExerciseToggle:       sinon.spy()
      getExerciseIsSelected:  sinon.stub().returns(false)
      getExerciseActions:     sinon.stub().returns({})
      onShowDetailsViewClick: sinon.spy()
      windowImpl: new FakeWindow
      watchStore: ExerciseStore
      watchEvent: 'testing-'

  it 'scrolls to exercse id on mount', ->
    @props.focusedExerciseId = EXERCISES.items[0].id
    Testing.renderComponent( Cards, props: @props ).then ({element}) =>
      expect(@props.windowImpl.scroll).toHaveBeenCalled()
