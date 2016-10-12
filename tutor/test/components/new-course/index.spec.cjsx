{React, Testing, expect, sinon, _, spyOnComponentMethod} = require '../helpers/component-testing'

NewCourse = require '../../../src/components/new-course'
SelectType = require '../../../src/components/new-course/select-type'
SelectDates = require '../../../src/components/new-course/select-dates'
{ mount } = require 'enzyme'


describe 'Creating a course', ->

  beforeEach ->
    @props = {}

  it 'it starts by asking for the course type', ->
    wrapper = mount(<NewCourse {...@props} />)
    expect(wrapper.find(SelectType)).to.have.length(1)

  it 'advances when continue is clicked', ->
    spy = spyOnComponentMethod(NewCourse, 'onContinue')
    wrapper = mount(<NewCourse {...@props} />)
    wrapper.find('[data-appearance="intro_sociology"]').simulate('click')
    wrapper.find('.btn-primary').simulate('click')
    expect(spy.calledOnce).to.be.true
    expect(wrapper.find(SelectDates)).to.have.length(1)
