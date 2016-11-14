_              = require 'underscore'
React          = require 'react'
CourseListing = require '../../src/components/course-listing'
{CourseListingActions, CourseListingStore} = require '../../src/flux/course-listing'
{shallow, mount} = require 'enzyme'

{
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
  MASTER_COURSES_LIST,
  TUTOR_HELP,
  CONCEPT_COACH_HELP,
  STUDENT_ARCHIVED_COURSE
} = require '../courses-test-data'


describe 'Course Listing Component', ->

  it 'renders the listing', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    wrapper = mount(<CourseListing />)
    for course, i in MASTER_COURSES_LIST
      expect(wrapper.find("[data-course-id=#{course.id}]")).to.have.length(1)
    undefined

  it 'renders the listing without archived courses', ->
    courseList = _.flatten([MASTER_COURSES_LIST, STUDENT_ARCHIVED_COURSE])
    CourseListingActions.loaded(courseList)
    wrapper = shallow(<CourseListing />)
    expect(wrapper.find("CourseLink[courseId=#{STUDENT_ARCHIVED_COURSE.id}]")).to.have.length(0)
    undefined

  it 'renders empty courses if course list only contains arhived course', ->
    CourseListingActions.loaded([STUDENT_ARCHIVED_COURSE])
    wrapper = shallow(<CourseListing />)
    expect(wrapper.find("EmptyCourses")).to.have.length(1)
    undefined

  it 'renders course appropriate flag', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    wrapper = mount(<CourseListing />)
    for course, i in MASTER_COURSES_LIST
      expect(
        wrapper.find("[data-course-id=#{course.id}] .course-listing-item-brand").render().text()
      ).equal('Openstax Tutor')
    undefined


  it 'redirects to dashboard for a single course', ->
    CourseListingActions.loaded([STUDENT_COURSE_ONE_MODEL])
    wrapper = shallow(<CourseListing />)
    expect(wrapper.find('Redirect[to="/course/1"]')).to.have.length(1)
    undefined
