React = require 'react'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
SelectTopics = require './select-topics'
PlanFooter = require './footer'
ChapterSection = require './chapter-section'
PlanMixin = require './plan-mixin'
LoadableItem = require '../loadable-item'
TaskPlanBuilder = require './builder'

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
      index={index}/>

  renderSelected: ->
    if @props.selected.length
      <ul className='selected-reading-list'>
        <li>Currently selected</li>
        {_.map(@props.selected, @renderSection)}
      </ul>
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
    buttonStyle = if @props.selected?.length then 'primary' else 'default'
    header = <span>Select Readings</span>

    primary =
      <BS.Button
        className='-show-problems'
        bsStyle={buttonStyle}
        disabled={@props.selected?.length is 0}
        onClick={@hide}>Add Readings
      </BS.Button>

    <div className="reading-plan-select-topics">
      <SelectTopics
        primary={primary}
        header={header}
        courseId={@props.courseId}
        ecosystemId={@props.ecosystemId}
        planId={@props.planId}
        selected={@props.selected}
        cancel={@props.cancel}
        hide={@hide} />
    </div>

ReadingPlan = React.createClass
  displayName: 'ReadingPlan'
  mixins: [PlanMixin]

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)
    ecosystemId = TaskPlanStore.getEcosystemId(id, courseId)

    topics = TaskPlanStore.getTopics(id)
    formClasses = ['edit-reading', 'dialog']

    footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
      getBackToCalendarParams={@getBackToCalendarParams}
      goBackToCalendar={@goBackToCalendar}/>
    header = @builderHeader('reading')

    addReadingText = if topics?.length then 'Add More Readings' else 'Add Readings'


    if (@state?.showSectionTopics)
      formClasses.push('hide')
      selectReadings = <ChooseReadings
                        hide={@hideSectionTopics}
                        cancel={@cancelSelection}
                        courseId={courseId}
                        planId={id}
                        ecosystemId={ecosystemId}
                        selected={topics}/>

    if @state?.invalid then formClasses.push('is-invalid-form')

    if not @state.isVisibleToStudents
      addReadingsButton = <BS.Button id='reading-select'
        onClick={@showSectionTopics}
        bsStyle='default'>+ {addReadingText}
      </BS.Button>

    if (@state?.invalid and not topics?.length)
      readingsRequired = <span className="readings-required">
        Please add sections to this assignment
        <i className="fa fa-exclamation-circle"></i>
      </span>

    <div className='reading-plan task-plan' data-assignment-type='reading'>
      <BS.Panel bsStyle='primary'
        className={formClasses.join(' ')}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />

          <BS.Row>
            <BS.Col xs={12} md={12}>
              <ReviewReadings
                canEdit={not @state.isVisibleToStudents}
                courseId={courseId}
                planId={id}
                ecosystemId={ecosystemId}
                selected={topics}/>
              {addReadingsButton}
              {readingsRequired}
            </BS.Col>
          </BS.Row>

        </BS.Grid>
      </BS.Panel>
      {selectReadings}
    </div>

module.exports = {ReadingPlan}
