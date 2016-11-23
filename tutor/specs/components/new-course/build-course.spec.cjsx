{React, sinon, pause} = require '../helpers/component-testing'
{shallow} = require 'enzyme'

EnzymeContext = require '../helpers/enzyme-context'
BuildCourse = require '../../../src/components/new-course/build-course'

{NewCourseActions, NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: saving new course', ->

  beforeEach ->
    sinon.stub(NewCourseActions, 'save')
    @options = EnzymeContext.build()
  afterEach ->
    NewCourseActions.save.restore()

  it 'calls save once mounted', ->
    shallow(<BuildCourse course={NewCourseStore.newCourse()} />, @options)
    expect(NewCourseActions.save).to.have.been.called
    undefined

  describe 'after course is created', ->

    it 'redirects to Tutor for Tutor', ->
      NewCourseActions.created({id: '42', is_concept_coach: false})
      wrapper = shallow(<BuildCourse />, @options)
      NewCourseStore.emit('change')
      expect(@options.context.router.transitionTo).to.have.been.calledWith('/course/42')
      undefined

    it 'redirects to CC', ->
      NewCourseActions.created({id: '21', is_concept_coach: true})
      wrapper = shallow(<BuildCourse />, @options)
      NewCourseStore.emit('change')
      expect(@options.context.router.transitionTo).to.have.been.calledWith('/course/21/cc/help')
      undefined
