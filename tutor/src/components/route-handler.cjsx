React    = require 'react'
{Match}  = require 'react-router'
defaults = require 'lodash/defaults'
without  = require 'lodash/without'
extend   = require 'lodash/extend'

matchProps = (props) ->
  defaults({}, props, render: ->
    <props.component {...without(props, 'component', 'render')} />
  )

RouteHandler =

  studentOrTeacher: (StudentComponent, TeacherComponent, defaultProps = {} ) ->
    (props) ->
      {courseId} = props.params
      componentProps = extend(props, defaultProps)
      if CourseStore.isTeacher(courseId)
        <TeacherComponent {...courseId} {...componentProps} />
      else
        <StudentComponent {...courseId} {...componentProps} />

  generate: (routes) ->
    return null unless routes
    for route, i in routes
      <Match key={i} {...matchProps(route)} />

module.exports = RouteHandler
