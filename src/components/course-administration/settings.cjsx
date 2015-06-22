React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore, CourseActions} = require '../../flux/course'

CourseInformation = require './information'
PeriodRoster = require './period-roster'

module.exports = React.createClass
  displayName: 'CourseAdministration'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  renderPeriodTabs: (course) ->
    _.map course.periods, (period, index) ->
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <PeriodRoster period={period} />
      </BS.TabPane>

  render: ->
    course = CourseStore.get(@props.courseId)
    <div className='course-administration form-horizontal'>
      <CourseInformation course={course}/>
      <h2>Roster</h2>
      <BS.TabbedArea defaultActiveKey=0>
          {@renderPeriodTabs(course)}
      </BS.TabbedArea>

      <BS.Row>
        <BS.Col sm=2>
          <BS.Button>Save</BS.Button>
        </BS.Col>
        <BS.Col sm=2>
          <BS.Button>Cancel</BS.Button>
        </BS.Col>
      </BS.Row>

    </div>
