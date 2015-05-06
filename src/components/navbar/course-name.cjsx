React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

CourseName = React.createClass
  displayName: 'CourseName'

  render: ->
    {course} = @props
    coursenameComponent = null

    routeName = CurrentUserStore.getDashboardRoute(course?.id)

    if course
      coursenameComponent = <Router.Link
        to={routeName}
        params={{courseId: course.id}}
        className='navbar-brand'>
        {course.name}
      </Router.Link>

    coursenameComponent

module.exports = CourseName
