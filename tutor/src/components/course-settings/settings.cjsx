React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

LoadableItem = require '../loadable-item'
{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
TimeHelper = require '../../helpers/time'
CourseDataHelper = require '../../helpers/course-data'

Roster = require './roster'
TeacherRoster = require './teacher-roster'
RenameCourse  = require './rename-course'
SetTimezone   = require './set-timezone'
{default: LMSInfo } = require './lms-info'

module.exports = React.createClass
  displayName: 'CourseSettings'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = CourseStore.get(@props.courseId)
    termDates = CourseDataHelper.getCourseBounds(@props.courseId)

    <BS.Panel className='course-settings'>
      <BS.Row>
        <BS.Col xs={9} className='course-settings-title'>
          {course.name}
          <RenameCourse courseId={@props.courseId} course={course}/>
        </BS.Col>

        <LMSInfo xs={3} courseId={@props.courseId} />

      </BS.Row>
      <h4 className='course-settings-term'>
        {CourseStore.getTerm(@props.courseId)}
      </h4>

      <BS.Row>

        <BS.Col sm={6} className='course-settings-start-end-dates'>
          <span className='course-settings-detail'>
            Starts: {TimeHelper.toHumanDate(termDates.start)}
          </span>
          <span className='course-settings-detail'>
            Ends: {TimeHelper.toHumanDate(termDates.end)}
          </span>
        </BS.Col>

        <BS.Col sm={6} className='course-settings-timezone text-right'>
          <span className='course-settings-detail'>
            {CourseStore.getTimezone(@props.courseId)}
          </span>
          <SetTimezone courseId={@props.courseId}/>
        </BS.Col>

      </BS.Row>

      <div className="settings-section teachers">
        <LoadableItem
          id={@props.courseId}
          store={RosterStore}
          actions={RosterActions}
          renderItem={=> <TeacherRoster
            store={RosterStore}
            courseRoles={course.roles}
            courseId={@props.courseId}/>}
        />
      </div>

      <LoadableItem
        id={@props.courseId}
        store={RosterStore}
        actions={RosterActions}
        renderItem={=> <Roster courseId={@props.courseId}/>}
      />

    </BS.Panel>
