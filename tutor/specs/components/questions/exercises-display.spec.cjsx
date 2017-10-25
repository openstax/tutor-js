{Testing, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
ld = require 'lodash'

ExercisesDisplay = require '../../../src/components/questions/exercises-display'

COURSE  = require '../../../api/courses/1.json'
EXERCISES = require '../../../api/exercises'
READINGS  = require '../../../api/ecosystems/1/readings.json'
SECTION_IDS  = [234..242]
COURSE_ID = '1'
ECOSYSTEM_ID = '1'

{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'
{ default: Courses } = require '../../../src/models/courses-map'
{TocActions, TocStore} = require '../../../src/flux/toc'

describe 'QL exercises display', ->

  beforeEach ->
    @props =
      ecosystemId: '1'
      courseId: COURSE_ID
      helpTooltip: 'This is help'
      sectionIds: SECTION_IDS
    Courses.bootstrap([COURSE], { clear: true })
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, SECTION_IDS)
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    sinon.stub(ExerciseActions, 'saveExerciseExclusion').returns(null)

  afterEach ->
    ExerciseActions.saveExerciseExclusion.restore()

  it 'renders reading cards', ->
    defaultReadingCards = ExerciseStore.groupBySectionsAndTypes(
      ECOSYSTEM_ID, SECTION_IDS, withExcluded: true
    )?['reading']

    Testing.renderComponent( ExercisesDisplay, props: @props, unmountAfter: 20 ).then ({dom}) ->
      expect( dom.querySelectorAll('.openstax-exercise-preview').length ).to
        .equal(defaultReadingCards.count)


  it 'displays dialog when exercises are at minimum (5)', ->
    expect(EXERCISES.items.length).to.equal(5)
    Testing.renderComponent( ExercisesDisplay, props: @props ).then ({dom}) ->
      Testing.actions.click(dom.querySelector('.openstax-exercise-preview .action.exclude'))
      expect( ExerciseActions.saveExerciseExclusion ).not.to.have.been.called
      expect( document.querySelector('.question-library-min-exercise-exclusions') ).to.exist
      Testing.actions.click(
        document.querySelector('.question-library-min-exercise-exclusions .btn-default')
      )
      expect( ExerciseActions.saveExerciseExclusion ).to.have.been.called
