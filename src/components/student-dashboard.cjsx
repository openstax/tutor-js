React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StudentDashboardStore, StudentDashboardActions} = require '../flux/student-dashboard'
LoadableItem = require './loadable-item'
moment = require 'moment'
isStepComplete = (step) -> step.is_completed

DUMMY_COURSE_DATA = {
  type: { tag: "physics", title: "Physics" }
  title: "2nd Period  |  Mr. Andrew Garcia"
  endDate: moment('2015-10-20')
}

DontForgetPanel = React.createClass
  displayName: 'DontForgetPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  render: ->
    <BS.Panel header="Don't Forget">
     <BS.Col xs={3}>
       View Feedback<br/>
        HW 5: Acceleration
     </BS.Col>
     <BS.Col xs={3}>
      Recover Credit<br/>
      HW 5: Acceleration
     </BS.Col>
     <BS.Col xs={3}>
       View Feedback<br/>
       HW 4: Displacement
     </BS.Col>
     <BS.Col xs={3}>
       Recover Credit<br/>
       HW 4: Displacement
    </BS.Col>
    </BS.Panel>

EmptyPanel = React.createClass

      render: ->
         <BS.Panel>
           <div className="empty">{@props.children}</div>
         </BS.Panel>

ComingUpPanel = React.createClass
  displayName: 'ComingUpPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  render: ->
    <BS.Panel title="Coming Up">
    Coming Up!
    </BS.Panel>

UnknownEvent = React.createClass
  displayName: 'EventsViewPanel'
  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    event=@props.event
    <div>
      {event.title}
      {moment(event.due_at).format("ddd, MMMM Do")}
    </div>

EventRow = React.createClass
  displayName: 'EventRow'
  propTypes:
    cssClass: React.PropTypes.string.isRequired
    event:    React.PropTypes.object.isRequired
    feedback: React.PropTypes.string.isRequired
  render: ->
    <div className="task row #{@props.cssClass}">
     <BS.Col xs={1}  sm={1} className="icon"></BS.Col>
     <BS.Col xs={11} sm={7} className="title">{@props.children}</BS.Col>
     <BS.Col xs={6}  sm={2} className="feedback">{@props.feedback}</BS.Col>
     <BS.Col xs={5}  sm={2} className="due-at">{moment(@props.event.due_at).format("ddd, MMMM Do")}</BS.Col>
    </div>

ReadingEvent = React.createClass
  displayName: 'ReadingEvent'
  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    event=@props.event
    feedback = switch
      when _.all(event.steps,isStepComplete) then "Complete"
      when _.any(event.steps,isStepComplete) then "In progress"
      else "Not started"
    <EventRow feedback={feedback} event=event cssClass="reading">
        {event.title} | <a>reference view</a>
    </EventRow>

HomeworkEvent = React.createClass
  displayName: 'HomeworkEvent'
  propTypes:
    event: React.PropTypes.object.isRequired

  render: ->
    event=@props.event
    feedback = if moment(event.due_at).isBefore() # Past due, show correct/incorrect
      "#{_.all(event.steps, isStepComplete)}/#{event.steps.length} complete"
    else
      "?/? correct" # TODO: needs added to feed or an alternate calculation determined
    <EventRow feedback={feedback} event=event cssClass="homework">
        {event.title} | <a>view feedback</a> | <a>recover credit</a>
    </EventRow>

EventsViewPanel = React.createClass
  displayName: 'EventsViewPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired
    events:   React.PropTypes.array.isRequired
    startAt:  React.PropTypes.object.isRequired
    endAt:    React.PropTypes.object
    limit:    React.PropTypes.number
    title:    React.PropTypes.string

  renderTitle: ->
    if @props.title
      <h3>{@props.title}</h3>
    else
      <span>{@props.startAt.format("MMMM Do")} - {@props.endAt.format("MMMM Do")}</span>

  renderEvents: ->
    for event in @props.events || []
      switch event.type
        when 'reading'  then <ReadingEvent  event={event}/>
        when 'homework' then <HomeworkEvent event={event}/>
        else
          <UnknownEvent event={event}/>

  render: ->
    <BS.Panel header={@renderTitle()}>
      {@renderEvents()}
    </BS.Panel>

StudentDashboard = React.createClass
  displayName: 'StudentDashboard'

  contextTypes:
    router: React.PropTypes.func


  eventsByWeek: (courseId)->
    panels = []
    count  = 0 # safety first, don't render a few thousand panels because someone fat-fingered a course date
    weeks = {}
    tasks = StudentDashboardStore.tasksForCourseID(courseId)
    for task in tasks
      key = moment(task.due_at).format("YYYYww")
      (weeks[key] ||= []).push task
    weeks

  allEventsPanels: (weeks)->
    for week, events of weeks
      startAt = moment(week, "YYYYww")
      <EventsViewPanel
          events={events}
          startAt={startAt}
          endAt={startAt.clone().add(1,'week')}
        />

  upcomingWeek: (events, today)->
    week = today.startOf('week').format("YYYYww")
    events = events[week]
    if _.any(events)
      <EventsViewPanel
        events={events}
        startAt={today}
        endAt={today.clone().add(1,'week')}
      />
    else
      <EmptyPanel>No events this week</EmptyPanel>

  comingUpPanel: (events, today)->
    nextWeek = today.startOf('week').add(1,"week").format("YYYYww")
    if events[nextWeek]
      <EventsViewPanel
        events=events[nextWeek]
        title="Coming Up"
      />
    else
      <EmptyPanel>No upcoming events</EmptyPanel>

  renderDashBoard: (courseId)->
    events = @eventsByWeek(courseId)
    today = moment().startOf('day')
    courseInfo = StudentDashboardStore.get(courseId)
    course = DUMMY_COURSE_DATA
    course.id = courseId # <- FIXME: complete hack - remove when data is real
    #week = date.startOf('week').format("YYYYww")

    <div className={course.type.tag + " bg"}>
      <div className="container">
        <div className="big-header">{course.type.title}</div>
        <BS.Col xs={12} md={9}>
          <div className="period-title">{course.title}</div>

          <BS.TabbedArea animation={false}>

            <BS.TabPane eventKey={1} tab='This Week'>
              {@upcomingWeek(events, today)}

              <DontForgetPanel courseId={courseId}/>

              {@comingUpPanel(events, today)}

            </BS.TabPane>

            <BS.TabPane eventKey={2} tab='All Work'>
              {@allEventsPanels(events)}
            </BS.TabPane>

          </BS.TabbedArea>

        </BS.Col>
        <BS.Col xs={12} md={3}>
          <div className="rbox">
            <h3>How am I doing?</h3>
            <BS.Button bsStyle="primary" onClick={@viewWork} className="-view-my-work">
              View All My Work
            </BS.Button>
            <BS.Button bsStyle="primary" onClick={@viewFlightPath} className="-view-flightpath">
              View My Flight Path
            </BS.Button>
          </div>
        </BS.Col>
      </div>
    </div>
  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className="student-dashboard ">
      <LoadableItem
        id={courseId}
        store={StudentDashboardStore}
        actions={StudentDashboardActions}
        renderItem={=>@renderDashBoard(courseId)}
      />
    </div>

module.exports = {StudentDashboard}
