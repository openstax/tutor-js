{React, pause} = require '../helpers/component-testing'

CourseDetails = require '../../../src/components/new-course/course-details'
{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'
{CourseActions, CourseStore} = require '../../../src/flux/course'

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'


describe 'CreateCourse: entering details', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)

  it 'sets default field values', ->
    NewCourseActions.set(cloned_from_id: COURSE_ID, name: 'Test but Verify')
    wrapper = shallow(<CourseDetails />)
    expect(
      wrapper.find("FormControl[type=\"number\"][value=1]")
    ).to.have.length(1)
    expect(
      wrapper.find("FormControl[type=\"text\"][value=\"Test but Verify\"]")
    ).to.have.length(1)
    undefined

  it 'updates flux values when edited', ->
    wrapper = mount(<CourseDetails />)
    wrapper.find('.course-details-name .form-control')
      .simulate('change', target: value: 'My Course')
    wrapper.find('.course-details-sections .form-control')
      .simulate('change', target: value: 12)
    expect(NewCourseStore.get('name')).to.equal('My Course')
    expect(NewCourseStore.get('num_sections')).to.equal(12)
    undefined
