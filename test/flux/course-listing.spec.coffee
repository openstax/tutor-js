{expect} = require 'chai'
{CourseListingStore, CourseListingActions} = require '../../src/flux/course-listing'
{CourseStore} = require '../../src/flux/course'
{
  STUDENT_ARCHIVED_COURSE,
  MASTER_COURSES_LIST
} = require '../courses-test-data'
_ = require 'lodash'

describe 'CourseListing Store', ->
  it 'can get all courses after being loaded', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    expect(CourseListingStore.allCourses().length).to.equal(MASTER_COURSES_LIST.length)

  it 'maps to course store', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    courses = CourseListingStore.allCourses()
    _.each courses, (course) ->
      expect(_.isEqual(course, CourseStore.get(course.id))).to.equal(true)

  it 'can filter archived courses', ->
    CourseListingActions.loaded([STUDENT_ARCHIVED_COURSE])
    expect(CourseListingStore.allCourses().length).to.equal(1)
    expect(CourseListingStore.allCoursesWithRoles().length).to.equal(0)
