React = require 'react'
BS = require 'react-bootstrap'

{CourseStore, CourseActions} = require '../../flux/course'
Administration = require './administration'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseAdministrationShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={courseId}
      store={CourseStore}
      actions={CourseActions}
      renderItem={-> <Administration courseId={courseId} />}
    />
