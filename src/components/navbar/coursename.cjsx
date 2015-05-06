React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'

{CurrentUserActions} = require '../../flux/current-user'
{CourseStore} = require '../../flux/course'

CourseMenuMixin =
  # TODO discussssssss.
  # Perhaps this logic should be in a store, perhaps it should be here in a mixin.
  # Perhaps, we should have one type of place for all of these types of things.
  _routes:
    dashboard:
      label: 'Dashboard'
      roles:
        teacher: 'taskplans'
        student: 'viewStudentDashboard'
        default: 'dashboard'
    guide:
      label: 'Learning Guide'
      roles:
        student: 'viewGuide'

  _getRouteByRole: (routeType, menuRole) ->
    @_routes[routeType].roles[menuRole] or @_routes[routeType].roles.default

  getDashboardRoute: (menuRole) ->
    @_getRouteByRole('dashboard', menuRole)

  getMenuRoutes: (menuRole) ->
    routes = [
      'dashboard'
      'guide'
    ]

    _.chain(routes)
      .map((routeType) =>
        routeName = @_getRouteByRole(routeType, menuRole)

        if routeName?
          name: routeName
          label: @_routes[routeType].label
      )
      .compact()
      .value()


CourseName = React.createClass
  displayName: 'CourseName'

  mixins: [CourseMenuMixin]

  render: ->
    {course, menuRole} = @props
    coursenameComponent = null

    routeName = @getDashboardRoute(menuRole)

    if course
      coursenameComponent = <Router.Link
        to={routeName}
        params={{courseId: course.id}}
        className='navbar-brand'>
        {course.name}
      </Router.Link>

    coursenameComponent

module.exports = {CourseName, CourseMenuMixin}
