{React, Testing, expect, sinon, _, pause, spyOnComponentMethod} = require '../helpers/component-testing'

Wizard = require '../../../src/components/new-course/wizard'
SelectType = require '../../../src/components/new-course/select-type'
SelectCourse = require '../../../src/components/new-course/select-course'
{ mount } = require 'enzyme'

# SnapShot = require 'react-test-renderer'

describe 'Creating a course', ->

  beforeEach ->
    @props = {}

  it 'it starts by asking for the course type', ->
    wrapper = mount(<Wizard {...@props} />)
    expect(wrapper.find(SelectType)).to.have.length(1)
    undefined

  it 'advances when continue is clicked', ->
    spy = spyOnComponentMethod(Wizard, 'onContinue')
    wrapper = mount(<Wizard {...@props} />)
    wrapper.find('.type.tutor').simulate('click')
    pause().then ->
      wrapper.find('.btn.next').simulate('click')
      expect(spy.calledOnce).to.be.true
      expect(wrapper.find(SelectCourse)).to.have.length(1)

  it 'can go backwards', ->
    wrapper = mount(<Wizard {...@props} />)
    expect(wrapper.find('.btn.back')).to.have.length(0)
    wrapper.find('.type.tutor').simulate('click')
    pause().then ->
      wrapper.find('.btn.next').simulate('click')
      backBtn = wrapper.find('.btn.back')
      expect(backBtn).to.have.length(1)
      expect(backBtn.render().is('[disabled]')).to.be.false

  # snapshots currently do not work because of bug with React 15.3.x.
  # is fixed in 15.4 https://github.com/facebook/react/issues/7386
  xit 'matches snapshot', ->
    component = SnapShot.create(
      <Wizard />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
