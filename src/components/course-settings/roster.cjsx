React = require 'react'
BS = require 'react-bootstrap'
_  = require 'underscore'

{CourseStore} = require '../../flux/course'
{RosterStore, RosterActions} = require '../../flux/roster'
BindStoreMixin = require '../bind-store-mixin'
PeriodRoster = require './period-roster'

module.exports = React.createClass
  displayName: 'PeriodRoster'
  mixins: [BindStoreMixin]
  bindStore: RosterStore
  propTypes:
    courseId: React.PropTypes.string.isRequired

  updateCourseName:(courseId)->
    RosterActions.save(@props.courseId)
    console.log('waka kinda working');

  changeCourseName:->
    course = CourseStore.get(@props.courseId)
    <BS.Popover tilte={'Change Course Name'} {...@props}>
      <form onSubmit={@updateCourseName} >
        edit <input className='courseTitle' ></input>
         <input type="submit" className="submit" value="rename" onSubmit={@updateCourseName}/>
      </form>
    </BS.Popover>

  render: ->
    course = CourseStore.get(@props.courseId)
    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
        <BS.OverlayTrigger rootClose={true} trigger='click' placement='right'
          overlay={@changeCourseName()}>
             <a><i className='fa' />Change Period Name</a>
          </BS.OverlayTrigger>
        <PeriodRoster period={period} courseId={@props.courseId} />
      </BS.TabPane>

    <BS.TabbedArea defaultActiveKey=0>
      {tabs}
    </BS.TabbedArea>
