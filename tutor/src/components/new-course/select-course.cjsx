React = require 'react'
BS = require 'react-bootstrap'

first   = require 'lodash/first'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
isEmpty = require 'lodash/isEmpty'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
TutorRouter = require '../../helpers/router'

{OfferingsStore} = require '../../flux/offerings'

CourseInformation = require '../../flux/course-information'

Choice = require './choice'

KEY = "offering_id"

COURSE_TYPE_NAMES =
  cc: 'Concept Coach'
  tutor: 'Tutor'

SelectCourse = React.createClass
  displayName: 'SelectCourse'
  statics:
    title: 'Which course are you teaching?'
    shouldSkip: ->
      Boolean(
        TutorRouter.currentParams().sourceId and
        NewCourseStore.get('offering_id') and
        OfferingsStore.get(NewCourseStore.get('offering_id'))
      )

  getInitialState: ->
    offerings = OfferingsStore.filter(is_concept_coach: NewCourseStore.get('course_type') is 'coach')
    {offerings}

  onSelect: (id) ->
    NewCourseActions.set({"#{KEY}": id})

  componentWillMount: ->
    {offerings} = @state
    return if NewCourseStore.get(KEY)? or offerings.length > 1 or isEmpty(offerings)

    @onSelect(first(offerings).id)

  render: ->
    {offerings} = @state

    <BS.ListGroup>
      {for offering in offerings
        {appearance_code} = OfferingsStore.get(offering.id)
        <Choice
          key={"course-choice-offering-#{offering.id}"}
          data-appearance={appearance_code}
          active={isEqual(NewCourseStore.get(KEY), offering.id)}
          onClick={partial(@onSelect, offering.id)}
        >
          {CourseInformation.forAppearanceCode(appearance_code).title}
        </Choice>}
    </BS.ListGroup>


module.exports = SelectCourse
