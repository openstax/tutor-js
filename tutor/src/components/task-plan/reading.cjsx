React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router-dom'
classnames = require 'classnames'

{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
SelectTopics = require './select-topics'
{default: PlanFooter} = require './footer'
ChapterSection = require './chapter-section'
PlanMixin = require './plan-mixin'
LoadableItem = require '../loadable-item'
TaskPlanBuilder = require './builder'
{ default: NoQuestionsTooltip } = require './reading/no-questions-tooltip'
Fn = require '../../helpers/function'
{ default: TourRegion } = require '../tours/region'

ReviewReadingLi = React.createClass
  displayName: 'ReviewReadingLi'
  propTypes:
    planId: React.PropTypes.string.isRequired
    topicId: React.PropTypes.string.isRequired
    canEdit: React.PropTypes.bool

  moveReadingUp: ->
    TaskPlanActions.moveReading(@props.planId, @props.topicId, -1)

  moveReadingDown: ->
    TaskPlanActions.moveReading(@props.planId, @props.topicId, 1)

  removeTopic: ->
    TaskPlanActions.removeTopic(@props.planId, @props.topicId)

  getActionButtons: ->
    if @props.index
      moveUpButton = <BS.Button onClick={@moveReadingUp} className="btn-xs -move-reading-up">
        <i className="fa fa-arrow-up"/>
      </BS.Button>

    if @props.canEdit
      <span className='section-buttons'>
        {moveUpButton}
        <BS.Button onClick={@moveReadingDown} className="btn-xs move-reading-down">
          <i className="fa fa-arrow-down"/>
        </BS.Button>
        <BS.Button className="remove-topic" onClick={@removeTopic} bsStyle="default">
          <i className="fa fa-close"/>
        </BS.Button>
      </span>

  render: ->
    topic = TocStore.getSectionInfo(@props.topicId)
    actionButtons = @getActionButtons()

    <li className='selected-section'>
      <ChapterSection section={topic.chapter_section}/>
      <span className='section-title'>{topic?.title}</span>
      {actionButtons}
    </li>

ReviewReadings = React.createClass
  displayName: 'ReviewReadings'
  propTypes:
    planId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array
    canEdit: React.PropTypes.bool

  renderSection: (topicId, index) ->
    <ReviewReadingLi
      topicId={topicId}
      planId={@props.planId}
      canEdit={@props.canEdit}
      index={index}
      key="review-reading-#{index}"/>

  renderSelected: ->
    if @props.selected.length
      <TourRegion
        tag="ul"
        delay=4000
        className="selected-reading-list"
        id={"add-reading-review-sections"}
        courseId={@props.courseId}
      >
        <li>Currently selected</li>
        {_.map(@props.selected, @renderSection)}
      </TourRegion>
    else
      <div className='-selected-reading-list-none'></div>

  render: ->
    <LoadableItem
      id={@props.ecosystemId}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderSelected}
    />

ChooseReadings = React.createClass
  hide: ->
    TaskPlanActions.sortTopics(@props.planId)
    @props.hide()

  render: ->
    buttonStyle = 'primary'
    header = <span>Select Readings</span>

    primary =
      <BS.Button
        className='-show-problems'
        bsStyle={buttonStyle}
        disabled={@props.selected?.length is 0}
        onClick={@hide}>Add Readings
      </BS.Button>

    <SelectTopics
      primary={primary}
      onSectionChange={Fn.empty}
      header={header}
      type="reading"
      courseId={@props.courseId}
      ecosystemId={@props.ecosystemId}
      planId={@props.planId}
      selected={@props.selected}
      cancel={@props.cancel}
      hide={@hide} />

ReadingPlan = React.createClass
  displayName: 'ReadingPlan'
  mixins: [PlanMixin]

  getInitialState: ->
    showSectionTopics: false

  render: ->
    {id, courseId} = @props
    builderProps = _.pick(@state, 'isVisibleToStudents', 'isEditable', 'isSwitchable')
    hasError = @hasError()

    plan = TaskPlanStore.get(id)
    ecosystemId = TaskPlanStore.getEcosystemId(id, courseId)

    topics = TaskPlanStore.getTopics(id)

    footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
      hasError={hasError}
      isVisibleToStudents={@state.isVisibleToStudents}
      getBackToCalendarParams={@getBackToCalendarParams}
      goBackToCalendar={@goBackToCalendar}/>
    header = @builderHeader('reading')

    addReadingText = if topics?.length then 'Add More Readings' else 'Add Readings'


    if (@state.showSectionTopics)
      selectReadings = <ChooseReadings
                        hide={@hideSectionTopics}
                        cancel={@cancelSelection}
                        courseId={courseId}
                        planId={id}
                        ecosystemId={ecosystemId}
                        selected={topics}/>

    formClasses = classnames 'edit-reading', 'dialog',
      'hide': @state.showSectionTopics
      'is-invalid-form': hasError

    if not @state.isVisibleToStudents
      addReadingsButton = <BS.Button id='reading-select'
        className={classnames("-select-sections-btn", "invalid": hasError and not topics?.length)}
        onClick={@showSectionTopics}
        bsStyle='default'>+ {addReadingText}
      </BS.Button>

    if (hasError and not topics?.length)
      readingsRequired = <span className="readings-required">
        Please add readings to this assignment.
      </span>

    <div className='reading-plan task-plan' data-assignment-type='reading'>
      <BS.Panel
        className={formClasses}
        footer={footer}
        header={header}
      >

        {<BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} {...builderProps}/>

          <BS.Row>
            <BS.Col xs={12} md={12}>
              <ReviewReadings
                canEdit={not @state.isVisibleToStudents}
                courseId={courseId}
                planId={id}
                ecosystemId={ecosystemId}
                selected={topics}/>
              {addReadingsButton}
              <NoQuestionsTooltip/>
              {readingsRequired}
            </BS.Col>
          </BS.Row>

        </BS.Grid> unless @state.showSectionTopics}
      </BS.Panel>
      {selectReadings}
    </div>

module.exports = {ReadingPlan}
