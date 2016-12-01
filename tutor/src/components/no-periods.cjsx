_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
TutorLink = require './link'
CourseGroupingLabel = require './course-grouping-label'

NoPeriods = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    noPanel:  React.PropTypes.bool
    link:  React.PropTypes.bool

  onAddSection: ->


  render: ->
    <div className="no-periods">
      <p>
        Please add at least
        one <CourseGroupingLabel courseId={@props.courseId} lowercase /> to the course.
      </p>

      <BS.Button bsStyle="primary" onClick={@onAddSection}>
        Add a <CourseGroupingLabel courseId={@props.courseId} />
      </BS.Button>

    </div>

module.exports = NoPeriods
