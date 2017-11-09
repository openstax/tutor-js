_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
TutorLink = require './link'
CourseGroupingLabel = require './course-grouping-label'
Router = require '../helpers/router'

NoPeriods = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    button:   React.PropTypes.element

  contextTypes:
    router: React.PropTypes.object

  onAddSection: ->
    @context.router.history.push(
      Router.makePathname('courseRoster',
        {courseId: @props.courseId},
        query: {add: true}
      )
    )


  AddButton: ->
    <BS.Button
      className='no-periods-course-settings-link'
      bsStyle="primary"
      onClick={@onAddSection}
    >
      Add a <CourseGroupingLabel courseId={@props.courseId} />
    </BS.Button>

  render: ->

    <div className="no-periods-message">
      <p>
        Please add at least
        one <CourseGroupingLabel courseId={@props.courseId} lowercase /> to the course.
      </p>

      {@props.button or <@AddButton />}

    </div>

module.exports = NoPeriods
