{React, sinon, pause} = require '../helpers/component-testing'
{mount} = require 'enzyme'

BuildCourse = require '../../../src/components/new-course/build-course'

{NewCourseActions, NewCourseStore} = require '../../../src/flux/new-course'

describe 'CreateCourse: saving new course', ->

  beforeEach ->
    sinon.stub(NewCourseActions, 'save')
  afterEach ->
    NewCourseActions.save.restore()

  it 'it transitions to ready after save', ->
    wrapper = mount(<BuildCourse />)
    expect(NewCourseActions.save.calledOnce).to.be.true
    expect(wrapper.text()).to.include('building')
    expect(wrapper.find('.ox-loader')).to.have.length(1)
    NewCourseActions.created({id: '1'})
    wrapper.setState({})
    expect(wrapper.find('.ox-loader')).to.have.length(0)
    expect(wrapper.text()).to.include('course is ready')
    undefined

  it 'has a product dependent link', ->
    NewCourseActions.created({id: 1})
    wrapper = shallow(<BuildCourse />)
    expect(wrapper.find('TutorLink[to="dashboard"]')).to.have.length(1)
    NewCourseActions.created({id: 1, is_concept_coach: true})
    wrapper.setState({})
    expect(wrapper.find('TutorLink[to="ccDashboardHelp"]')).to.have.length(1)
    undefined
