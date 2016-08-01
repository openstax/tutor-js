{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
ld = require 'lodash'

ExercisesDisplay = require '../../../src/components/questions/exercises-display'

EXERCISES = require '../../../api/exercises'
SECTION_IDS  = [1, 2]
COURSE_ID = '1'

{ExerciseActions} = require '../../../src/flux/exercise'


describe 'QL exercises display', ->

  beforeEach ->
    @props =
      courseId: COURSE_ID
      helpTooltip: 'This is help'
      sectionIds: SECTION_IDS
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, SECTION_IDS)
    sinon.stub(ExerciseActions, 'saveExerciseExclusion').returns(null)

  afterEach ->
    ExerciseActions.saveExerciseExclusion.restore()

  it 'renders cards', ->
    Testing.renderComponent( ExercisesDisplay, props: @props ).then ({dom}) ->
      expect( dom.querySelectorAll('.openstax-exercise-preview').length ).to
        .equal(EXERCISES.items.length)

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

  it 'saves exercise exclusions immediately when not at minimum', ->
    ex = ld.cloneDeep(EXERCISES)
    ex.items = ex.items.slice(0, 3)
    ExerciseActions.loadedForCourse(ex, COURSE_ID, SECTION_IDS)
    Testing.renderComponent( ExercisesDisplay, props: @props ).then ({dom}) ->
      Testing.actions.click(dom.querySelector('.openstax-exercise-preview .action.exclude'))
      expect( ExerciseActions.saveExerciseExclusion ).to.have.been
        .calledWith(COURSE_ID, ex.items[0].id, true)
