React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
isEmpty = require 'lodash/isEmpty'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseListingStore} = require '../../flux/course-listing'
TutorRouter = require '../../helpers/router'

{CourseChoiceItem} = require './choice'

KEY = "new_or_copy"

SelectDates = React.createClass
  statics:
    title: "Choose to create a new course or copy a previous course"
    shouldSkip: ->
      TutorRouter.currentQuery()?.courseId or
      isEmpty(CourseListingStore.teachingCoursesForOffering(NewCourseStore.get('offering_id')))

  onSelect: (value) ->
    NewCourseActions.set({"#{KEY}": value})

  render: ->

    <BS.ListGroup>
      <CourseChoiceItem
        key='course-new'
        active={isEqual(NewCourseStore.get(KEY), 'new')}
        onClick={partial(@onSelect, 'new')}
        data-new-or-copy='new'
      >
        Create a new course
      </CourseChoiceItem>
      <CourseChoiceItem
        key='course-copy'
        active={isEqual(NewCourseStore.get(KEY), 'copy')}
        onClick={partial(@onSelect, 'copy')}
        data-new-or-copy='copy'
      >
        Copy a past course
      </CourseChoiceItem>
    </BS.ListGroup>


module.exports = SelectDates
