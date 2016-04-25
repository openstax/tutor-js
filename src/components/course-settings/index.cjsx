React = require 'react'
BS = require 'react-bootstrap'

{CourseStore, CourseActions} = require '../../flux/course'
Settings = require './settings'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseSettingsShell'
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  render: ->
    {courseId} = @context.params
    <LoadableItem
      id={courseId}
      store={CourseStore}
      actions={CourseActions}
      renderItem={-> <Settings courseId={courseId} />}
    />
