{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

ld = require 'lodash'


Exercises = require '../../../src/components/qa/exercises'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'
{EcosystemsActions, EcosystemsStore} = require '../../../src/flux/ecosystems'
{ReferenceBookActions, ReferenceBookStore} = require '../../../src/flux/reference-book'

EXERCISES  = require '../../../api/exercises.json'
ECOSYSTEMS = require '../../../api/ecosystems.json'
PAGE = require '../../../api/ecosystems/3/readings.json'
COURSE_ID = '1'
ECOSYSTEM_ID = '3'
CNX_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'


describe 'QA Exercises Component', ->

  beforeEach (done) ->
    @props = {
      cnxId: CNX_ID
      ecosystemId: ECOSYSTEM_ID
      section: 'test-section'
    }
    EcosystemsActions.loaded(ECOSYSTEMS)
    ReferenceBookActions.loaded(PAGE, ECOSYSTEM_ID)
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, ['146'])
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'displays the exercise questions', ->
    Testing.renderComponent( Exercises, props: @props ).then ({dom}) ->
      questions = _.map EXERCISES.items, (e) ->
        e.content.questions[0].stem_html

      renderedQs = _.pluck dom.querySelectorAll('.panel-body .question-stem'), 'textContent'
      expect(renderedQs).to.deep.equal(questions)

  it 'displays free-response box when previewing 2-step', ->
    Testing.renderComponent( Exercises, props: @props ).then ({dom, element}) ->
      expect( dom.querySelector('.exercise-free-response-preview') ).to.not.exist
      cb = dom.querySelector('.preview2step')
      ReactTestUtils.Simulate.change(cb, {target: checked: true})
      freeResponseCount = _.reduce(EXERCISES.items, (count, ex) ->
        count + (if ExerciseStore.hasQuestionWithFormat('free-response', ex) then 1 else 0)
      , 0)
      expect( dom.querySelectorAll('.exercise-free-response-preview').length )
        .to.equal(freeResponseCount)

  it 'renders exercises even if they dont have tags', ->
    ex = ld.cloneDeep EXERCISES
    _.each ex.items, (e) -> e.content.tags = []
    ExerciseActions.loadedForCourse(ex, COURSE_ID, ['146'])
    Testing.renderComponent( Exercises, props: @props ).then ({dom, element}) ->
      expect( dom.querySelectorAll('.exercise').length ).to.equal(5)

  it 'hides exercise lo tags that don\'t belong to current book', ->
    ex = ld.cloneDeep EXERCISES
    _.each ex.items, (e) -> e.content.tags.push("lo:uknown-fake-uuid")
    ExerciseActions.loadedForCourse(ex, COURSE_ID, ['146'])
    Testing.renderComponent( Exercises, props: @props ).then ({dom, element}) ->
      expect( dom.textContent ).not.to.contain('uknown-fake-uuid')

  it 'displays question formats', ->
    Testing.renderComponent( Exercises, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.formats-listing')).to.exist
