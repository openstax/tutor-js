{React, sinon, mount} = require '../helpers/component-testing'

CourseDetails = require '../../../src/components/new-course/course-details'
{CourseListingActions, CourseListingStore} = require '../../../src/flux/course-listing'

{MASTER_COURSES_LIST} = require '../../courses-test-data'

describe 'CreateCourse: entering details', ->

  beforeEach ->
    @props =
      onContinue: sinon.spy()
      onCancel: sinon.spy()
      course_code: 'college_biology'

  it 'it does not display the tabs when no courses are loaded', ->
    wrapper = mount(<CourseDetails {...@props} />)
    expect(wrapper.find('.other-courses')).to.be.empty

  it 'toggles the tabs when course are present', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    @props.course_code = 'testing'
    wrapper = mount(<CourseDetails {...@props} />)
    expect(wrapper.find('.other-courses')).not.to.be.empty
    wrapper.find('.nav').find('a').last().simulate('click')
    expect(wrapper.text()).to.include('Local Test Course Two')
