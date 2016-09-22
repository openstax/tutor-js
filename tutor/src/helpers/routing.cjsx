React    = require 'react'
{Match}  = require 'react-router'
defaults = require 'lodash/defaults'
without  = require 'lodash/without'
extend   = require 'lodash/extend'

{CourseStore} = require '../flux/course'

matchProps = (props) ->
  defaults({}, props, render: ->
    <props.component {...without(props, 'component', 'render')} />
  )

RoutingHelper =

  studentOrTeacher: (StudentComponent, TeacherComponent, defaultProps = {} ) ->
    (props) ->
      {courseId} = props.params
      componentProps = extend(props, defaultProps)
      if CourseStore.isTeacher(courseId)
        <TeacherComponent courseId={courseId} {...componentProps} />
      else
        <StudentComponent courseId={courseId} {...componentProps} />


  subroutes: (routes) ->
    return null unless routes
    for route, i in routes
      <Match key={i} {...matchProps(route)} />

module.exports = RoutingHelper
