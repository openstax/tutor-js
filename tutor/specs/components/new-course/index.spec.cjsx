{React, Testing, expect, sinon, _, pause, spyOnComponentMethod} = require '../helpers/component-testing'

NewCourse = require '../../../src/components/new-course'
SelectType = require '../../../src/components/new-course/select-type'
SelectCourse = require '../../../src/components/new-course/select-course'
{ mount } = require 'enzyme'

# SnapShot = require 'react-test-renderer'

describe 'Creating a course', ->

  beforeEach ->
    @props = {}

  it 'it starts by asking for the course type', ->
    wrapper = mount(<NewCourse {...@props} />)
    expect(wrapper.find(SelectType)).to.have.length(1)
    undefined

  it 'advances when continue is clicked', ->
    spy = spyOnComponentMethod(NewCourse, 'onContinue')
    wrapper = mount(<NewCourse {...@props} />)
    wrapper.find('.type.tutor').simulate('click')
    pause().then ->
      wrapper.find('.btn-primary').simulate('click')
      expect(spy.calledOnce).to.be.true
      expect(wrapper.find(SelectCourse)).to.have.length(1)


  # snapshots currently do not work because of bug with React 15.3.x.
  # is fixed in 15.4 https://github.com/facebook/react/issues/7386
  xit 'matches snapshot', ->
    component = SnapShot.create(
      <NewCourse />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
