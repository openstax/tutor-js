{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

ExerciseDetails = require '../../../src/components/exercises/details'

EXERCISES = require '../../../api/exercises'
ECOSYSTEM_ID = '1'

describe 'Exercise Details Component', ->


  beforeEach ->
    @props =
      ecosystemId: ECOSYSTEM_ID
      selectedExercise: EXERCISES.items[0]
      exercises: {grouped: { '1.1': EXERCISES.items} }
      onExerciseToggle:      sinon.spy()
      onShowCardViewClick:   sinon.spy()
      getExerciseActions:    sinon.stub().returns({})
      getExerciseIsSelected: sinon.stub().returns(false)

  it 'sends current exercise along when showing card view', ->
    Testing.renderComponent( ExerciseDetails, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.show-cards'))
      expect(@props.onShowCardViewClick).to.have.been.calledWith(sinon.match.any, @props.selectedExercise, sinon.match.any)
