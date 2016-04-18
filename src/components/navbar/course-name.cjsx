React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'
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
      coursenameComponent = <Link
        to={routeName}
        params={{courseId: course.id}}
        className='navbar-brand'>
        {course.name}
      </Link>

    coursenameComponent

module.exports = CourseName
