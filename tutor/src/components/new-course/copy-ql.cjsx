React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseChoiceItem} = require './choice'

ERRATA_EXPLAIN =
  <p key='errata-explain'>
    Some questions have been added, corrected or removed to improve the quality of
    the Question Library.  You can always make changes before publishing assignments.
  </p>

MESSAGES = [
  [
    <p key='dont-copy-explain'>
      Any questions you previously excluded <strong>will not be</strong> excluded in your new course.
    </p>
    ERRATA_EXPLAIN
  ]
  [
    <p key='copy-explain'>
      Any questions you previously excluded will remain excluded in your new course.
    </p>
    ERRATA_EXPLAIN
  ]
]

KEY = 'copy_question_library'

CopyQL = React.createClass
  statics:
    title: 'Do you want to copy the same questions?'
    shouldSkip: -> # nothing to copy if no source course
      not NewCourseStore.get('cloned_from_id')

  onSelect: (value) ->
    NewCourseActions.set({"#{KEY}": value})

  render: ->
    <div className="copy-ql">
      <BS.ListGroup>
        <CourseChoiceItem
          key='copy-library'
          active={isEqual(NewCourseStore.get(KEY), true)}
          onClick={partial(@onSelect, true)}
          data-copy-or-not='copy'
        >
          Copy
        </CourseChoiceItem> 
        <CourseChoiceItem
          key='dont-copy-library'
          active={isEqual(NewCourseStore.get(KEY), false)}
          onClick={partial(@onSelect, false)}
          data-copy-or-not='dont-copy'
        >
          Don’t copy
        </CourseChoiceItem>          
      </BS.ListGroup>
      <div
        className={classnames('explain', 'alert',
          'alert-info': NewCourseStore.get(KEY)
          'alert-danger': not NewCourseStore.get(KEY)
        )}
      >
        {MESSAGES[NewCourseStore.get(KEY) * 1]}
      </div>
    </div>

module.exports = CopyQL
