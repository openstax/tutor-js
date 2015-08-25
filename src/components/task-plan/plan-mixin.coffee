React = require 'react'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TimeStore} = require '../../flux/time'
Close = require '../close'
S = require '../../helpers/string'

moment = require 'moment'
# we should gather things somewhere nice.
CALENDAR_DATE_FORMAT = 'YYYY-MM-DD'

PlanMixin =
  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    isSavedPlanVisibleToStudent = TaskPlanStore.isVisibleToStudents(@props.id or @props.planId)

    isVisibleToStudents: isSavedPlanVisibleToStudent
    isEditable: TaskPlanStore.isEditable(@props.id or @props.planId)

  updateIsVisibleAndIsEditable: ->
    isVisibleToStudents = TaskPlanStore.isVisibleToStudents(@props.id or @props.planId)
    isEditable = TaskPlanStore.isEditable(@props.id or @props.planId)
    @setState({isVisibleToStudents, isEditable})

  componentWillMount: ->
    TaskPlanStore.on('publish-queued', @updateIsVisibleAndIsEditable)

  componentWillUnmount: ->
    TaskPlanStore.off('publish-queued', @updateIsVisibleAndIsEditable)

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  showSectionTopics: ->
    @setState({
      showSectionTopics: true,
      savedTopics: TaskPlanStore.getTopics(@props.id),
      savedExercises: TaskPlanStore.getExercises(@props.id)
    })

  cancelSelection: ->
    TaskPlanActions.updateTopics(@props.id, @state.savedTopics)
    TaskPlanActions.updateExercises(@props.id, @state.savedExercises)
    @hideSectionTopics()

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  publish: ->
    {id} = @props
    saveable = TaskPlanStore.isValid(id)
    TaskPlanActions.publish(id) if saveable
    @save()

  save: ->
    {id} = @props
    saveable = TaskPlanStore.isValid(id)
    # The logic here is this way because we need to be able to add an invalid
    # state to the form.  Blame @fredasaurus
    if (saveable)
      TaskPlanActions.saved.addListener(@saved)
      TaskPlanActions.save(id)
    else
      @setState({invalid: true})

  saved: ->
    courseId = @props.courseId
    TaskPlanActions.saved.removeListener('change', @saved)
    TaskPlanStore.isLoading(@props.id)
    @goBackToCalendar()

  cancel: ->
    {id} = @props
    if confirm('Are you sure you want to cancel?')
      TaskPlanActions.resetPlan(id)
      @goBackToCalendar()

  # TODO move to helper type thing.
  getBackToCalendarParams: ->
    {id, courseId} = @props
    calendarRoute = 'calendarByDate'
    dueAt = TaskPlanStore.getFirstDueDate(id) or @context.router.getCurrentQuery().due_at
    if dueAt?
      date = moment(dueAt).format(CALENDAR_DATE_FORMAT)
    else
      date = moment(TimeStore.getNow()).format(CALENDAR_DATE_FORMAT)

    unless TaskPlanStore.isNew(id) or not TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
      calendarRoute = 'calendarViewPlanStats'
      planId = id

    to: calendarRoute
    params: {courseId, date, planId}

  goBackToCalendar: ->
    {to, params} = @getBackToCalendarParams()
    @context.router.transitionTo(to, params)

  builderHeader: (type) ->
    {id} = @props
    type = S.capitalize(type)

    if TaskPlanStore.isNew(id)
      headerText = "Add #{type} Assignment"
    else if TaskPlanStore.isDeleteRequested(id)
      headerText = "#{type} is being deleted"
    else
      headerText = "Edit #{type} Assignment"

    headerSpan = <span key='header-text'>{headerText}</span>

    closeBtn = <Close
      key='close-button'
      className='pull-right'
      onClick={@cancel}/>

    [headerSpan, closeBtn]

module.exports = PlanMixin
