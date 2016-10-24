React = require 'react'
BS = require 'react-bootstrap'
Router = require '../../helpers/router'
{CourseStore, CourseActions} = require '../../flux/course'
Settings = require './settings'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseSettingsShell'

  render: ->
    {courseId} = Router.currentParams()
    <LoadableItem
      id={courseId}
      store={CourseStore}
      actions={CourseActions}
      renderItem={-> <Settings courseId={courseId} />}
    />
