React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

CourseName = React.createClass
  displayName: 'CourseName'

  propTypes:
    course: React.PropTypes.object

  mixins: [BindStoreMixin]
  bindStore: CourseStore

  render: ->

    {course} = @props
    course = CourseStore.get(course?.id)

    coursenameComponent = null

    routeName = CurrentUserStore.getDashboardRoute(course?.id)

    if course
      courseNameTooltip =
        <BS.Tooltip id="course-name-tooltip">
          <div>{course.name}</div>
        </BS.Tooltip>
      coursenameComponent =
        <BS.OverlayTrigger
          placement='bottom'
          delayShow={1000}
          delayHide={0}
          overlay={courseNameTooltip}>
            <Router.Link
              to={routeName}
              params={{courseId: course.id}}
              className='navbar-brand'>
              <div className="course-name">{course.name}</div>
            </Router.Link>
        </BS.OverlayTrigger>

    coursenameComponent

module.exports = CourseName
