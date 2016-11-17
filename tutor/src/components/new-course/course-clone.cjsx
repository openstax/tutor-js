React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
isEmpty = require 'lodash/isEmpty'
map = require 'lodash/map'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseListingStore} = require '../../flux/course-listing'
{CourseChoiceItem} = require './choice'

KEY = "cloned_from_id"

SelectDates = React.createClass
  statics:
    title: "Choose a semester to copy"
    shouldSkip: ->
      NewCourseStore.get('new_or_copy') is 'new'

  onSelect: (course) ->
    NewCourseActions.set("#{KEY}": course.id)
    NewCourseActions.set('name': course.name)
    NewCourseActions.set('num_sections': course.periods.length)

  render: ->
    courses = CourseListingStore.teachingCoursesForOffering(NewCourseStore.get('offering_id'))

    <BS.ListGroup>
      {_.map(courses, (course) =>
        <CourseChoiceItem
          key="course-clone-#{course.id}"
          active={isEqual(NewCourseStore.get(KEY), course.id)}
          onClick={partial(@onSelect, course)}
        >
          {course.name}
          <p className='course-clone-term'>{course.term} {course.year}</p>
        </CourseChoiceItem>
      )}
    </BS.ListGroup>


module.exports = SelectDates
