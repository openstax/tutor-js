{React, sinon, pause} = require '../helpers/component-testing'

BuildCourse = require '../../../src/components/new-course/build-course'

{NewCourseActions, NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: saving new course', ->

  beforeEach ->
    sinon.stub(NewCourseActions, 'save')
  afterEach ->
    NewCourseActions.save.restore()

  it 'it transitions to ready after save', ->
    wrapper = shallow(<BuildCourse />)
    expect(NewCourseActions.save.calledOnce).to.be.true
    expect(wrapper.text()).to.include('building')
    NewCourseActions.created({id: 1})
    wrapper.setState({})
    expect(wrapper.text()).to.include('course is ready')
    undefined
