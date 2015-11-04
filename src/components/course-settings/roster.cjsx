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

  updateCourseName:(courseId) ->
    #RosterActions.save(period_id: periodId)
    waka = @refs.updatePeriod.getDOMNode().value
    console.log({waka})

  changeCourseName: ->
    <BS.Popover title={'Change Course Name'}>
      <form onSubmit={@updateCourseName} >
        edit <input type="text" className='courseTitle' ref="updatePeriod" ></input>
         <input type="submit" className="submit" value="rename"  onSubmit={@updateCourseName}/>
      </form>
    </BS.Popover>

  renderPopover: ->
    <BS.OverlayTrigger rootClose={true} trigger='click' placement='right'
          overlay={@changeCourseName()}>
      <a><i className='fa' />Change Period Name</a>
    </BS.OverlayTrigger>

  render: ->
    course = CourseStore.get(@props.courseId)
    popOver = @renderPopover()


    tabs = _.map course.periods, (period, index) =>
      <BS.TabPane key={period.id}, eventKey={index} tab={period.name}>
          {popOver}
        <PeriodRoster period={period} courseId={@props.courseId} />
      </BS.TabPane>

    <BS.TabbedArea defaultActiveKey=0>
      {tabs}
    </BS.TabbedArea>
