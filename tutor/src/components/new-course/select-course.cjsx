React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
map = require 'lodash/map'
isEqual = require 'lodash/isEqual'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

{OfferingsStore} = require '../../flux/offerings'
CourseOffering = require './offering'

KEY = "offering_id"

SelectCourse = React.createClass
  statics:
    title: "Choose your Tutor course"
    shouldSkip: ->
      NewCourseStore.get('cloned_from_id') and NewCourseStore.get(KEY)

  onSelect: (id) ->
    NewCourseActions.set({"#{KEY}": id})

  render: ->
    offerings =
      OfferingsStore.filter(is_concept_coach: NewCourseStore.get('course_type') is 'cc')

    <BS.ListGroup>
      {_.map(offerings, (offering) =>
        <BS.ListGroupItem
          key={"course-choice-offering-#{offering.id}"}
          active={isEqual(NewCourseStore.get(KEY), offering.id)}
          onClick={partial(@onSelect, offering.id)}
        >
          <CourseOffering offeringId={offering.id}/>
        </BS.ListGroupItem>
      )}

    </BS.ListGroup>


module.exports = SelectCourse
