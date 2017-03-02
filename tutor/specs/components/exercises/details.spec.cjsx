jest.mock '../../../src/helpers/exercise'
ExerciseHelpers = require '../../../src/helpers/exercise'

{React, Testing, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

ExerciseDetails = require '../../../src/components/exercises/details'

EXERCISES = require '../../../api/exercises'
ECOSYSTEM_ID = '1'

describe 'Exercise Details Component', ->


  beforeEach ->
    @errorLinkSpy = sinon.spy()
    @props =
      courseId: '1'
      ecosystemId: ECOSYSTEM_ID
      selectedExercise: EXERCISES.items[0]
      exercises: {grouped: { '1.1': EXERCISES.items} }
      onExerciseToggle:      sinon.spy()
      onShowCardViewClick:   sinon.spy()
      getExerciseActions:    sinon.stub().returns({
        'report-error':
          message: 'Report an error'
          handler: @errorLinkSpy
        })
      getExerciseIsSelected: sinon.stub().returns(false)

  it 'sends current exercise along when showing card view', ->
    Testing.renderComponent( ExerciseDetails, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.show-cards'))
      expect(@props.onShowCardViewClick).to.have.been.calledWith(sinon.match.any, @props.selectedExercise)

  it 'links to error url form', ->
    details = mount(<ExerciseDetails {...@props} />)
    expect(details).toHaveRendered('.action.report-error')
    details.find('.action.report-error').simulate('click') #prop('onClick')()
    expect(@errorLinkSpy).to.have.been.calledWith(sinon.match.any, @props.selectedExercise)
    undefined
