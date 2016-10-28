React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

MESSAGES =
  copy: '''
    Copying allows you to import the state of the Question Library from your past course.
    Excluded questions will remain excluded in the new course, but you can still make
    changes later. The new library will also include errata corrections and new questions
    added by OpenStax.
  '''

  fresh: '''
    If you don't copy the question library, questions excluded in the course you are
    copying won't be excluded in the new course.  The new library will, however,
    reflect errata corrections and new questions added by OpenStax.
  '''

KEY = 'copy_ql'

CopyQL = React.createClass
  statics:
    title: "Choose whether to copy the Question Library"
    shouldSkip: -> # nothing to copy if no source course
      !NewCourseStore.get('source_course_id')

  onSelect: (value) ->
    NewCourseActions.set({"#{KEY}": value})

  render: ->
    <div className="copy-ql">
      <BS.Table striped bordered>
        <tbody>
          <tr
            onClick={partial(@onSelect, 'copy')}
            className={classnames('copy', selected: NewCourseStore.get(KEY) is 'copy')}
          >
            <td>Copy Question Library</td>
          </tr>
          <tr
            onClick={partial(@onSelect, 'fresh')}
            className={classnames('fresh', selected: NewCourseStore.get(KEY) is 'fresh')}
          >
            <td>Don’t copy Question Library</td>
          </tr>
        </tbody>
      </BS.Table>
      <div
        className={classnames('explain', 'alert', {
          'alert-info': NewCourseStore.get(KEY) is 'fresh'
          'alert-danger': NewCourseStore.get(KEY) is 'copy'
        })}
      >
        {MESSAGES[NewCourseStore.get(KEY) or 'copy']}
      </div>
    </div>

module.exports = CopyQL
