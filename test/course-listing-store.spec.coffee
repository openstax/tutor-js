{expect} = require 'chai'
_ = require 'underscore'

{CourseListingActions, CourseListingStore} = require '../src/flux/course-listing'
{CourseStore} = require '../src/flux/course'

COURSES = require '../api/user/courses.json'

describe 'CourseListing Store', ->
  beforeEach ->
    CourseListingActions.loaded(COURSES)

  it 'should load courses', ->
    expect(CourseListingStore.isLoaded()).to.be.true
    names = _.pluck(CourseListingStore.allValidCourses(), 'name')
    expect(names).to.deep.equal(_.pluck(COURSES, 'name'))

  it 'should clear the store and the course store on reset', ->
    CourseListingActions.reset()
    expect(CourseListingStore.isLoaded()).to.be.false
    expect(CourseStore.get(COURSES[0].id)).to.be.null
