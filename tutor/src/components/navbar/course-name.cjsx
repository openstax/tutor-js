React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
TutorLink = require '../link'

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
            <TutorLink
              to='dashboard'
              params={courseId: course.id}
              className='navbar-brand'>
              <div className="course-name">{course.name}</div>
            </TutorLink>
        </BS.OverlayTrigger>

    coursenameComponent

module.exports = CourseName
