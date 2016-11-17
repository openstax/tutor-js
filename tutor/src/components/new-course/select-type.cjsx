React = require 'react'
BS = require 'react-bootstrap'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseChoiceItem} = require './choice'

KEY = 'course_type'

SelectType = React.createClass

  statics:
    title: "Choose the tool you want to use in your course"
    shouldSkip: ->
      NewCourseStore.get('cloned_from_id') and NewCourseStore.get(KEY)

  onSelectType: (type) ->
    NewCourseActions.set({"#{KEY}": type})

  render: ->
    types =
      tutor:  'tutor-beta'
      cc:     'coach'

    <BS.ListGroup>
      {for type, logo of types
        <CourseChoiceItem
          key={type}
          data-brand={logo}
          active={isEqual(NewCourseStore.get(KEY), type)}
          onClick={partial(@onSelectType, type)}
        />}
    </BS.ListGroup>


module.exports = SelectType
