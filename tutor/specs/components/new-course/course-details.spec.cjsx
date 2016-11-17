{React, pause} = require '../helpers/component-testing'

CourseDetails = require '../../../src/components/new-course/course-details'
{CourseListingActions, CourseListingStore} = require '../../../src/flux/course-listing'

{MASTER_COURSES_LIST} = require '../../courses-test-data'

{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

describe 'CreateCourse: entering details', ->

  it 'sets flux values', ->
    wrapper = mount(<CourseDetails />)
    wrapper.find('.course-details-name .form-control')
      .simulate('change', target: value: 'My Course')
    wrapper.find('.course-details-sections .form-control')
      .simulate('change', target: value: 12)

    expect(NewCourseStore.get('name')).to.equal('My Course')
    expect(NewCourseStore.get('num_sections')).to.equal(12)
    undefined
