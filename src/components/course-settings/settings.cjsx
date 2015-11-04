React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
Roster = require './roster'
LoadableItem = require '../loadable-item'

module.exports = React.createClass
  displayName: 'CourseSettings'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)

    <BS.Panel className='course-settings'>

      <span className='course-settings-title'>{course.name}</span>

      <div className="periods">
        <LoadableItem
          id={@props.courseId}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> <Roster courseId={@props.courseId}/>}
        />
      </div>

    </BS.Panel>
