React = require 'react'
extend  = require 'lodash/extend'
{default: Courses} = require '../../models/courses-map'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TaskingStore, TaskingActions} = require '../../flux/tasking'
{PastTaskPlansActions} = require '../../flux/past-task-plans'

{TimeStore} = require '../../flux/time'
{CloseButton} = require 'shared'
TutorDialog = require '../tutor-dialog'
S = require '../../helpers/string'
Router = require '../../helpers/router'

moment = require 'moment'
# we should gather things somewhere nice.
CALENDAR_DATE_FORMAT = 'YYYY-MM-DD'

PlanMixin =
  contextTypes:
    router: React.PropTypes.object

  getInitialState: ->
    extend(@getStates(), displayValidity: false)

  getCourse: ->
    Courses.get(@props.courseId)

  getStates: ->
    id = @props.id or @props.planId
    {courseId} = @props

    isPublishedOrPublishing = TaskPlanStore.isPublished(id) or TaskPlanStore.isPublishing(id)
    isTaskOpened = TaskingStore.isTaskOpened(id)

    isVisibleToStudents = (isPublishedOrPublishing and isTaskOpened) or false
    isEditable = TaskPlanStore.isEditable(id)
    isSwitchable = not isVisibleToStudents or TaskingStore.hasAllTaskings(id)

    invalid = not @isSaveable()

    {isVisibleToStudents, isEditable, isSwitchable, invalid}

  updateIsVisibleAndIsEditable: ->
    @setState(@getStates())

  componentWillMount: ->
    {id} = @props

    TaskPlanStore.on('publish-queued', @updateIsVisibleAndIsEditable)
    TaskPlanStore.on("loaded.#{id}", @updateIsVisibleAndIsEditable)
    TaskPlanStore.on('change', @updateValidity)
    TaskingStore.on("taskings.#{id}.*.loaded", @updateIsVisibleAndIsEditable)

  componentWillUnmount: ->
    {id} = @props

    TaskPlanStore.off('publish-queued', @updateIsVisibleAndIsEditable)
    TaskPlanStore.off("loaded.#{id}", @updateIsVisibleAndIsEditable)
    TaskPlanStore.off('change', @updateValidity)
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
    TaskPlanActions.publish(@props.id) if @isSaveable()
    @save()

  isWaiting: ->
    {id} = @props
    !! (TaskPlanStore.isSaving(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id))

  isSaveable: ->
    {id} = @props

    TaskPlanStore.isValid(id) and
      TaskingStore.isTaskValid(id) and
      not TaskPlanStore.isPublishing(id)

  hasError: ->
    @state.displayValidity and @state.invalid

  updateValidity: ->
    @setState(invalid: not @isSaveable())

  save: ->
    {id, courseId} = @props

    if @isSaveable()
      @setState(invalid: false)
      if TaskPlanStore.hasChanged(id)
        TaskPlanStore.once("saved.#{id}", @saved)
        if @props.save? then @props.save(id, courseId) else TaskPlanActions.save(id, courseId)
      else
        @saved()
      true
    else
      @setState(invalid: true, displayValidity: true)
      false

  saved: (savedPlan) ->
    courseId = @props.courseId

    if savedPlan
      TaskPlanActions.loaded(savedPlan, savedPlan.id)
      TaskingActions.loadTaskToCourse(savedPlan.id, courseId)
      TaskingActions.loadTaskings(savedPlan.id, savedPlan.tasking_plans)
      PastTaskPlansActions.unload(courseId, savedPlan.cloned_from_id) if savedPlan.cloned_from_id

    if @afterSave? then @afterSave(savedPlan) else @goBackToCalendar()

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
    TaskingActions.resetFor(id)
    @goBackToCalendar()

  # TODO move to helper type thing.
  getBackToCalendarParams: ->
    {id, courseId} = @props
    dueAt = TaskingStore.getFirstDueDate(id) or @context.router.getCurrentQuery().due_at
    if dueAt?
      date = dueAt
    else
      date = TimeStore.getNow()
    date = moment(date).format(CALENDAR_DATE_FORMAT)
    {courseId, date}

  goBackToCalendar: ->
    @context.router.history.push(
      Router.makePathname('calendarByDate', @getBackToCalendarParams())
    )

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
