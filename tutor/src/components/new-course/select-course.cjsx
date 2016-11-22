React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
first = require 'lodash/first'
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
  displayName: 'SelectCourse'
  statics:
    title: 'Which course are you teaching?'
    shouldSkip: ->
      TutorRouter.currentQuery()?.courseId

  onSelect: (id) ->
    NewCourseActions.set({"#{KEY}": id})

  componentWillMount: ->
    offerings = OfferingsStore.filter(is_concept_coach: NewCourseStore.get('course_type') is 'cc')
    @onSelect(first(offerings).id) unless NewCourseStore.get(KEY)?

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
