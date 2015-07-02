React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
Roster = require './roster'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseAdministration'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)

    <div className='course-administration form-horizontal'>
      <h2>Course: {course.name}</h2>
      <h2>Roster</h2>
      <div className="periods">

        <LoadableItem
          id={@props.courseId}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> <Roster courseId={@props.courseId}/>}
        />

      </div>
    </div>
