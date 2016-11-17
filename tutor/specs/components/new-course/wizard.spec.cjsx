{React, spyOnComponentMethod, pause} = require '../helpers/component-testing'
extend = require 'lodash/extend'

Wizard = require '../../../src/components/new-course/wizard'
SelectType = require '../../../src/components/new-course/select-type'
SelectCourse = require '../../../src/components/new-course/select-course'

{CourseListingActions} = require '../../../src/flux/course-listing'

# SnapShot = require 'react-test-renderer'

stubCourse = (courseData) ->
  extend({}, {roles: [{type: 'teacher'}]}, courseData)


describe 'Creating a course', ->

  beforeEach ->
    CourseListingActions.loaded([ stubCourse(is_concept_coach: true)])
    @props = {}

  it 'it skips course type if coach not previously taught', ->
    CourseListingActions.loaded([ stubCourse(is_concept_coach: false)])
    wrapper = mount(<Wizard {...@props} />)
    expect(wrapper.find(SelectType)).to.have.length(0)
    expect(wrapper.find(SelectCourse)).to.have.length(1)
    undefined

  it 'it starts by asking for the course type if coach is previously taught', ->

    wrapper = mount(<Wizard {...@props} />)
    expect(wrapper.find(SelectType)).to.have.length(1)
    undefined

  it 'advances when continue is clicked', ->
    spy = spyOnComponentMethod(Wizard, 'onContinue')
    wrapper = mount(<Wizard {...@props} />)
    wrapper.find('[data-brand="tutor-beta"]').simulate('click')
    pause().then ->
      wrapper.find('.btn.next').simulate('click')
      expect(spy.calledOnce).to.be.true
      expect(wrapper.find(SelectCourse)).to.have.length(1)

  it 'can go backwards', ->
    wrapper = mount(<Wizard {...@props} />)
    expect(wrapper.find('.btn.back')).to.have.length(0)
    wrapper.find('[data-brand="tutor-beta"]').simulate('click')
    wrapper.render()
    wrapper.find('.btn.next').simulate('click')
    backBtn = wrapper.find('.btn.back')
    expect(backBtn).to.have.length(1)
    expect(backBtn.render().is('[disabled]')).to.be.false
    undefined

  # snapshots currently do not work because of bug with React 15.3.x.
  # is fixed in 15.4 https://github.com/facebook/react/issues/7386
  xit 'matches snapshot', ->
    component = SnapShot.create(
      <Wizard />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
