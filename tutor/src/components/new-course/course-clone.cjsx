React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
isEmpty = require 'lodash/isEmpty'
map = require 'lodash/map'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseListingStore} = require '../../flux/course-listing'
TutorRouter = require '../../helpers/router'
Choice = require './choice'

KEY = "cloned_from_id"

CourseClone = React.createClass
  displayName: 'CourseClone'
  statics:
    title: 'Which course do you want to copy?'
    shouldSkip: ->
      isEmpty(NewCourseStore.get('new_or_copy')) or
        NewCourseStore.get('new_or_copy') is 'new' or
        TutorRouter.currentParams()?.sourceId

  getInitialState: ->
    courses: CourseListingStore.teachingCoursesForOffering(NewCourseStore.get('offering_id'))

  componentWillMount: ->
    {courses} = @state
    @onSelect(courses[0]) if courses.length is 1

  onSelect: (course) ->
    NewCourseActions.set("#{KEY}": course.id)
    NewCourseActions.set('name': course.name)
    NewCourseActions.set('num_sections': course.periods.length)

  render: ->
    {courses} = @state

    <BS.ListGroup>
      {_.map(courses, (course) =>
        <Choice
          key="course-clone-#{course.id}"
          active={isEqual(NewCourseStore.get(KEY), course.id)}
          onClick={partial(@onSelect, course)}
        >
          <div className="contents">
            <div className="title">{course.name}</div>
            <div className="sub-title">{course.term} {course.year}</div>
          </div>
        </Choice>
      )}
    </BS.ListGroup>


module.exports = CourseClone
