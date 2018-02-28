jest.mock '../../../src/helpers/exercise'
ExerciseHelpers = require '../../../src/helpers/exercise'

{React, Testing, _, ReactTestUtils} = require '../helpers/component-testing'

ExerciseDetails = require '../../../src/components/exercises/details'

EXERCISES = require '../../../api/exercises'
ECOSYSTEM_ID = '1'

describe 'Exercise Details Component', ->
  props = {}
  errorLinkSpy = null

  beforeEach ->
    errorLinkSpy = jest.fn()
    props =
      courseId: '1'
      ecosystemId: ECOSYSTEM_ID
      selectedExercise: EXERCISES.items[0]
      exercises: {grouped: { '1.1': EXERCISES.items} }
      onExerciseToggle:      jest.fn()
      onShowCardViewClick:   jest.fn()
      getExerciseActions:    jest.fn(() => ({
        'report-error':
          message: 'Report an error'
          handler: errorLinkSpy
        }))
      getExerciseIsSelected: jest.fn().mockReturnValue(false)

  it 'sends current exercise along when showing card view', ->
    Testing.renderComponent( ExerciseDetails, props: props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.show-cards'))
      expect(props.onShowCardViewClick).toHaveBeenCalledWith(expect.anything(), props.selectedExercise)

  it 'links to error url form', ->
    details = mount(<ExerciseDetails {...props} />)
    expect(details).toHaveRendered('.action.report-error')
    details.find('.action.report-error').simulate('click') #prop('onClick')()
    expect(errorLinkSpy).toHaveBeenCalledWith(expect.anything(), props.selectedExercise)
    undefined
