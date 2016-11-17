React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
TutorRouter = require '../../helpers/router'

{OfferingsStore} = require '../../flux/offerings'
CourseOffering = require './offering'

KEY = "offering_id"

COURSE_TYPE_NAMES =
  cc: 'Concept Coach'
  tutor: 'Tutor'

SelectCourse = React.createClass
  statics:
    title: ->
      "Choose your #{COURSE_TYPE_NAMES[NewCourseStore.get('course_type')]} course"
    shouldSkip: ->
      TutorRouter.currentQuery()?.courseId

  onSelect: (id) ->
    NewCourseActions.set({"#{KEY}": id})

  render: ->
    offerings =
      OfferingsStore.filter(is_concept_coach: NewCourseStore.get('course_type') is 'cc')

    <BS.ListGroup>
      {for offering in offerings
        <BS.ListGroupItem
          key={"course-choice-offering-#{offering.id}"}
          active={isEqual(NewCourseStore.get(KEY), offering.id)}
          onClick={partial(@onSelect, offering.id)}
        >
          <CourseOffering offeringId={offering.id}/>
        </BS.ListGroupItem>}
    </BS.ListGroup>


module.exports = SelectCourse
