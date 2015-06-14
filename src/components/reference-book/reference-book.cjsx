React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

BindStoreMixin = require '../bind-store-mixin'
NavBar = require './navbar'

{CourseListingStore} = require '../../flux/course-listing'
{CourseStore} = require '../../flux/course'

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [Router.State, BindStoreMixin]
  bindStore: CourseListingStore
  bindEvent: 'loaded'

  componentWillMount: ->
    CourseListingStore.ensureLoaded()

  render: ->
    {courseId} = @getParams()
    course = CourseStore.get(courseId)
    classnames = ["reference-book"]
    if course and _.findWhere(course.roles, type: 'teacher')
      classnames.push('is-teacher')
    <div className={classnames.join(' ')}>
      <NavBar courseId={courseId}/>
      <div className="content">
        <Router.RouteHandler courseId={courseId} />
      </div>
    </div>
