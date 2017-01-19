{React, SnapShot} = require '../helpers/component-testing'

ExerciseCard = require '../../../src/components/qa/exercise-card'

{EcosystemsActions, EcosystemsStore} = require '../../../src/flux/ecosystems'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'

ECOSYSTEMS = require '../../../api/ecosystems.json'
EXERCISES  = require '../../../api/exercises.json'
PAGE = require '../../../api/ecosystems/3/readings.json'
COURSE_ID = '1'
ECOSYSTEM_ID = '3'
CNX_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'


describe 'QA Exercises Card', ->

  beforeEach ->
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, ['146'])
    EcosystemsActions.loaded(ECOSYSTEMS)
    @props =
      exercise: EXERCISES.items[1]
      ignoredTypes: {}
      ecosystemId: ECOSYSTEM_ID
      section: '1.2'
      cnxId: CNX_ID

  it 'renders a book page', ->
    wrapper = shallow(<ExerciseCard {...@props} />)
    console.log wrapper.debug()
    expect(wrapper).toHaveRendered('OXExercisePreview')

  it 'matches snapshot', ->
    expect(SnapShot.create(<ExerciseCard {...@props} />).toJSON()).toMatchSnapshot()
