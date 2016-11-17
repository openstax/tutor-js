React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseChoiceItem} = require './choice'

MESSAGES = [
  '''
    If you don't copy the question library, questions excluded in the course you are
    copying won't be excluded in the new course.  The new library will, however,
    reflect errata corrections and new questions added by OpenStax.
  ''',
  '''
    Copying allows you to import the state of the Question Library from your past course.
    Excluded questions will remain excluded in the new course, but you can still make
    changes later. The new library will also include errata corrections and new questions
    added by OpenStax.
  '''
]

KEY = 'copy_question_library'

CopyQL = React.createClass
  statics:
    title: "Choose whether to copy the Question Library"
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
        className={classnames('explain', 'alert', {
          'alert-info': NewCourseStore.get(KEY) is true
          'alert-danger': NewCourseStore.get(KEY) is false
        })}
      >
        {MESSAGES[NewCourseStore.get(KEY) * 1]}
      </div>
    </div>

module.exports = CopyQL
