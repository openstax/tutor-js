{React, spyOnComponentMethod, pause} = require '../helpers/component-testing'
extend = require 'lodash/extend'
uniqueId = require 'lodash/uniqueId'
Wizard = require '../../../src/components/new-course/wizard'
OFFERINGS = require '../../../api/offerings'

{OfferingsActions} = require '../../../src/flux/offerings'

{CourseListingActions} = require '../../../src/flux/course-listing'

SnapShot = require 'react-test-renderer'

stubCourse = (courseData) ->
  extend({id: uniqueId()}, {roles: [{type: 'teacher'}]}, courseData)


describe 'Creating a course', ->

  beforeEach ->
    CourseListingActions.loaded([ stubCourse(is_concept_coach: true)])
    OfferingsActions.loaded(OFFERINGS)
    @props =
      isLoading: false

  it 'it skips course type if a single kind was previously taught', ->
    CourseListingActions.loaded([ stubCourse(is_concept_coach: false)])
    wrapper = shallow(<Wizard {...@props} />)
    expect(wrapper.find('SelectType')).to.have.length(0)
    expect(wrapper.find('SelectCourse')).to.have.length(1)
    undefined

  it 'displays select type if multiple kinds were previously taught', ->
    CourseListingActions.loaded([
      stubCourse(is_concept_coach: true),
      stubCourse(is_concept_coach: false)
    ])
    wrapper = shallow(<Wizard {...@props} />)
    expect(wrapper.find('SelectType')).to.have.length(1)
    undefined

  it 'advances and can go back', ->
    spy = spyOnComponentMethod(Wizard, 'onContinue')
    wrapper = mount(<Wizard {...@props} />)
    wrapper.find('CourseChoiceItem').simulate('click')
    wrapper.find('.btn.next').simulate('click')
    expect(spy.calledOnce).to.be.true
    expect(wrapper.find('SelectDates')).to.have.length(1)
    wrapper.find('.btn.back').simulate('click')
    expect(wrapper.find('SelectCourse')).to.have.length(1)
    undefined


  it 'matches snapshot', ->
    component = SnapShot.create(
      <Wizard {...@props} />
    )
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    undefined
