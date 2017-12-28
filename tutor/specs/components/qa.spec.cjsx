{React, Testing, _, ReactTestUtils} = require './helpers/component-testing'

ld = require 'lodash'

Wrapper = require '../../src/components/qa'
Exercises = require '../../src/components/qa/exercises'

{ExerciseActions, ExerciseStore} = require '../../src/flux/exercise'

EXERCISES  = require '../../api/exercises.json'
ECOSYSTEMS = require '../../api/ecosystems.json'
PAGE = require '../../api/ecosystems/3/readings.json'
COURSE_ID = '1'
ECOSYSTEM_ID = '3'
CNX_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'


xdescribe 'QA Exercises Component', ->

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

  it 'waits until ecosystem load is complete before rendering', ->
    EcosystemsActions.loaded([])
    wrapper = shallow(<Wrapper {...@props} />)
    expect(wrapper).toHaveRendered('.loading')

    EcosystemsActions.loaded(ECOSYSTEMS)
    wrapper = shallow(<Wrapper {...@props} />)
    expect(wrapper).toHaveRendered('TutorRouterMatch')
    undefined

  it 'displays the exercise questions', ->
    wrapper = mount(<Exercises {...@props} />)
    stems = wrapper.find('.panel-body .question-stem').map (stem) -> stem.text()
    questions = _.map EXERCISES.items, (e) ->
      e.content.questions[0].stem_html
    expect(stems).to.deep.equal(questions)
    undefined

  it 'displays free-response box when previewing 2-step', ->
    wrapper = mount(<Exercises {...@props} />)
    expect(wrapper).not.toHaveRendered('.exercise-free-response-preview')
    wrapper.find('.preview2step').simulate('change', target: checked: true)
    freeResponseCount = _.reduce(EXERCISES.items, (count, ex) ->
      count + (if ExerciseStore.hasQuestionWithFormat('free-response', ex) then 1 else 0)
    , 0)
    wrapper.update()
    expect(wrapper.find('.exercise-free-response-preview'))
      .to.have.length(freeResponseCount)
    undefined

  it 'renders exercises even if they dont have tags', ->
    ex = ld.cloneDeep EXERCISES
    _.each ex.items, (e) -> e.content.tags = []
    ExerciseActions.loadedForCourse(ex, COURSE_ID, ['146'])
    wrapper = mount(<Exercises {...@props} />)
    expect(wrapper.find('.exercise')).to.have.length(5)
    undefined

  it 'hides exercise lo tags that don\'t belong to current book', ->
    ex = ld.cloneDeep EXERCISES
    item.content.tags = ["lo:uknown-fake-uuid"] for item in ex.items
    ExerciseActions.loadedForCourse(ex, COURSE_ID, ['146'])
    wrapper = mount(<Exercises {...@props} />)
    wrapper.find('.lo-tag').forEach (tag) ->
      expect(tag.text()).to.not.include('uknown-fake-uuid')
    undefined

  it 'displays question formats', ->
    wrapper = mount(<Exercises {...@props} />)
    expect(wrapper.find('.formats-listing')).to.have.length(EXERCISES.items.length)
    undefined
