{React, pause, mount} = require '../helpers/component-testing'

CourseDetails = require '../../../src/components/new-course/course-details'
{CourseListingActions, CourseListingStore} = require '../../../src/flux/course-listing'

{MASTER_COURSES_LIST} = require '../../courses-test-data'

{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

describe 'CreateCourse: entering details', ->

  beforeEach ->
    NewCourseActions.set(course_code: 'college_biology')

  it 'it does not display the tabs when no courses are loaded', ->
    wrapper = mount(<CourseDetails />)
    expect(wrapper.find('.other-courses')).to.be.empty
    undefined

  it 'toggles the tabs when course are present', ->
    NewCourseActions.set(course_code: 'testing')
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    wrapper = mount(<CourseDetails />)
    expect(wrapper.find('.other-courses')).not.to.be.empty
    wrapper.find('.nav').find('a').last().simulate('click')
    expect(wrapper.text()).to.include('Local Test Course Two')
    undefined

  it 'sets flux values', ->
    wrapper = mount(<CourseDetails />)
    wrapper.find('.course-name .form-control')
      .simulate('change', target: value: 'My Course')
    wrapper.find('.section-count .form-control')
      .simulate('change', target: value: 12)

    expect(NewCourseStore.get('course_name')).to.equal('My Course')
    expect(NewCourseStore.get('number_of_sections')).to.equal(12)
    undefined
