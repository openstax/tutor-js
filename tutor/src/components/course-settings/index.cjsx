React = require 'react'
# BS = require 'react-bootstrap'
# Router = require '../../helpers/router'
# {CourseStore, CourseActions} = require '../../flux/course'
# LoadableItem = require '../loadable-item'
# Settings = require './settings'
# { default: TourRegion } = require '../tours/region'

SettingsWithTour = (props) ->
  <TourRegion
    id="course-settings"
    otherTours={["course-settings-preview"]}
    courseId={props.courseId}
  >
    <Settings {...props} />
  </TourRegion>

module.exports = React.createClass
  displayName: 'CourseSettingsShell'

  render: ->
    return <h1>Settings!</h1>
