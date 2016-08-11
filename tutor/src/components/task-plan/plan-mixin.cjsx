React = require 'react'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TaskingStore, TaskingActions} = require '../../flux/tasking'
{TimeStore} = require '../../flux/time'
{CloseButton} = require 'shared'
TutorDialog = require '../tutor-dialog'
S = require '../../helpers/string'

moment = require 'moment'
# we should gather things somewhere nice.
CALENDAR_DATE_FORMAT = 'YYYY-MM-DD'

PlanMixin =
  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    @getStates()

  getStates: ->
    id = @props.id or @props.planId
    {courseId} = @props

    isPublishedOrPublishing = TaskPlanStore.isPublished(id) or TaskPlanStore.isPublishing(id)
    isTaskOpened = TaskingStore.isTaskOpened(id)

    isVisibleToStudents = (isPublishedOrPublishing and isTaskOpened) or false
    isEditable = TaskPlanStore.isEditable(id)
    isSwitchable = not isVisibleToStudents or TaskingStore.hasAllTaskings(id)

    {isVisibleToStudents, isEditable, isSwitchable}

  updateIsVisibleAndIsEditable: ->
    @setState(@getStates())

  componentWillMount: ->
    {id} = @props

    TaskPlanStore.on('publish-queued', @updateIsVisibleAndIsEditable)
    TaskPlanStore.on("loaded.#{id}", @updateIsVisibleAndIsEditable)
    TaskingStore.on("taskings.#{id}.*.loaded", @updateIsVisibleAndIsEditable)

  componentWillUnmount: ->
    {id} = @props

    TaskPlanStore.off('publish-queued', @updateIsVisibleAndIsEditable)
    TaskPlanStore.off("loaded.#{id}", @updateIsVisibleAndIsEditable)
    TaskingStore.off("taskings.#{id}.*.loaded", @updateIsVisibleAndIsEditable)

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
    saveable = TaskPlanStore.isValid(id) and TaskingStore.isTaskValid(id)
    TaskPlanActions.publish(id) if saveable
    @save()

  save: ->
    {id, courseId} = @props
    saveable = TaskPlanStore.isValid(id) and TaskingStore.isTaskValid(id)
    # The logic here is this way because we need to be able to add an invalid
    # state to the form.  Blame @fredasaurus
    if saveable
      if TaskPlanStore.hasChanged(id)
        TaskPlanActions.saved.addListener(@saved)
        TaskPlanActions.save(id, courseId)
      else
        @saved()
    else
      @setState({invalid: true})

  saved: ->
    courseId = @props.courseId
    TaskPlanActions.saved.removeListener('change', @saved)
    TaskPlanStore.isLoading(@props.id)
    @goBackToCalendar()

  cancel: ->
    {id, courseId} = @props

    if not TaskPlanStore.hasChanged(id)
      @reset()
    else
      TutorDialog.show(
        title: 'Unsaved Changes - Confirm'
        body: 'You will lose unsaved changes if you continue.  Do you really want to cancel?',
        okBtnText: 'Yes'
        cancelBtnText: 'No'
      ).then( =>
        @reset()
      )

  reset: ->
    {id, courseId} = @props
    TaskPlanActions.resetPlan(id)
    @goBackToCalendar()

  # TODO move to helper type thing.
  getBackToCalendarParams: ->
    {id, courseId} = @props
    calendarRoute = 'calendarByDate'
    dueAt = TaskingStore.getFirstDueDate(id) or @context.router.getCurrentQuery().due_at
    if dueAt?
      date = dueAt
    else
      date = TimeStore.getNow()

    date = moment(date).format(CALENDAR_DATE_FORMAT)

    unless TaskPlanStore.isNew(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
      calendarRoute = 'calendarViewPlanStats'
      planId = id

    to: calendarRoute
    params: {courseId, date, planId}

  goBackToCalendar: ->
    {to, params} = @getBackToCalendarParams()
    @context.router.transitionTo(to, params)

  builderHeader: (type, label = 'Assignment') ->
    {id} = @props
    label = " #{label}" if label
    type = S.capitalize(type)

    if TaskPlanStore.isNew(id)
      headerText = "Add #{type}#{label}"
    else if TaskPlanStore.isDeleteRequested(id)
      headerText = "#{type} is being deleted"
    else
      headerText = "Edit #{type}#{label}"

    headerSpan = <span key='header-text'>{headerText}</span>

    closeBtn = <CloseButton
      key='close-button'
      className='pull-right'
      onClick={@cancel}/>

    [headerSpan, closeBtn]

module.exports = PlanMixin
