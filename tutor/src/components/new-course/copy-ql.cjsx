React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

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
      <BS.Table striped bordered>
        <tbody>
          <tr
            onClick={partial(@onSelect, true)}
            className={classnames('true', selected: NewCourseStore.get(KEY) is true)}
          >
            <td>Copy Question Library</td>
          </tr>
          <tr
            onClick={partial(@onSelect, false)}
            className={classnames('false', selected: NewCourseStore.get(KEY) is false)}
          >
            <td>Don’t copy Question Library</td>
          </tr>
        </tbody>
      </BS.Table>
      <div
        className={classnames('explain', 'alert', {
          'alert-info': NewCourseStore.get(KEY) is true
          'alert-danger': NewCourseStore.get(KEY) is false
        })}
      >
        {MESSAGES[NewCourseStore.get(KEY) or true]}
      </div>
    </div>

module.exports = CopyQL
