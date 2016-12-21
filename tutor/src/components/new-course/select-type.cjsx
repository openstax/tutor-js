React = require 'react'
BS = require 'react-bootstrap'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
isEmpty = require 'lodash/isEmpty'

TutorRouter = require '../../helpers/router'

CCLogo = require 'shared/src/components/logos/concept-coach-horizontal'
TutorLogo = require 'shared/src/components/logos/tutor-horizontal'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseListingStore} = require '../../flux/course-listing'
Choice = require './choice'

KEY = 'course_type'

SelectType = React.createClass
  displayName: 'SelectType'
  statics:
    title: 'Which tool do you want to use?'
    shouldSkip: ->
      TutorRouter.currentParams().sourceId

  onSelectType: (type) ->
    NewCourseActions.set({"#{KEY}": type})

  render: ->
    types =
      tutor: TutorLogo
      coach: CCLogo

    <BS.ListGroup>
      {for type, Logo of types
        <Choice
          key={type}
          data-brand={type}
          active={isEqual(NewCourseStore.get(KEY), type)}
          onClick={partial(@onSelectType, type)}
        >
          <Logo />
        </Choice>}
    </BS.ListGroup>


module.exports = SelectType
