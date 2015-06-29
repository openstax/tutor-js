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
Close = require '../close'
ChapterSection = require './chapter-section'
PlanMixin = require './plan-mixin'
LoadableItem = require '../loadable-item'
ConfirmLeaveMixin = require '../confirm-leave-mixin'
TaskPlanBuilder = require './builder'

ReviewReadingLi = React.createClass
  displayName: 'ReviewReadingLi'
  propTypes:
    planId: React.PropTypes.string.isRequired
    topicId: React.PropTypes.string.isRequired

  moveReadingUp: ->
    TaskPlanActions.moveReading(@props.planId, @props.topicId, -1)

  moveReadingDown: ->
    TaskPlanActions.moveReading(@props.planId, @props.topicId, 1)

  removeTopic: ->
    TaskPlanActions.removeTopic(@props.planId, @props.topicId)

  render: ->
    topic = TocStore.getSectionInfo(@props.topicId)

    if @props.index
      moveUpButton = <BS.Button onClick={@moveReadingUp} className="btn-xs -move-reading-up">
        <i className="fa fa-arrow-up"/>
      </BS.Button>

    <li className='selected-section'>
      <ChapterSection section={topic.chapter_section}/>
      <span className='section-title'>{topic?.title}</span>
      <span className='section-buttons'>
        {moveUpButton}
        <BS.Button onClick={@moveReadingDown} className="btn-xs move-reading-down">
          <i className="fa fa-arrow-down"/>
        </BS.Button>
        <BS.Button className="remove-topic" onClick={@removeTopic} bsStyle="default">
          <i className="fa fa-close"/>
        </BS.Button>
      </span>
    </li>

ReviewReadings = React.createClass
  displayName: 'ReviewReadings'
  propTypes:
    planId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array

  renderSection: (topicId, index) ->
    <ReviewReadingLi topicId={topicId} planId={@props.planId} index={index}/>

  renderSelected: ->
    if @props.selected.length
      <ul className='selected-reading-list'>
        <li>Currently selected sections in this reading</li>
        {_.map(@props.selected, @renderSection)}
      </ul>
    else
      <div className='-selected-reading-list-none'></div>

  render: ->
    <LoadableItem
      id={@props.courseId}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderSelected}
    />

ChooseReadings = React.createClass
  hide: ->
    TaskPlanActions.sortTopics(@props.planId)
    @props.hide()

  render: ->
    buttonStyle = if @props.selected?.length then 'primary' else 'disabled'
    header = <span>Select Readings</span>

    primary =
      <BS.Button
        className='-show-problems'
        bsStyle={buttonStyle}
        onClick={@hide}>Add Readings
      </BS.Button>

    <SelectTopics
      primary={primary}
      header={header}
      courseId={@props.courseId}
      planId={@props.planId}
      selected={@props.selected}
      hide={@hide} />

ReadingPlan = React.createClass
  displayName: 'ReadingPlan'
  mixins: [PlanMixin]

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    headerText = <span key='header-text'>
      {if TaskPlanStore.isNew(id) then 'Add Reading Assignment' else 'Edit Reading Assignment'}
    </span>
    topics = TaskPlanStore.getTopics(id)
    formClasses = ['edit-reading', 'dialog']
    closeBtn = <Close
      key='close-button'
      className='pull-right'
      onClick={@cancel}/>

    footer = <PlanFooter id={id} courseId={courseId} onPublish={@publish} onSave={@save}/>
    header = [headerText, closeBtn]

    addReadingText = if topics?.length then 'Add More Readings' else 'Add Readings'


    if (@state?.showSectionTopics)
      formClasses.push('hide')
      selectReadings = <ChooseReadings
                        hide={@hideSectionTopics}
                        courseId={courseId}
                        planId={id}
                        selected={topics}/>

    if @state?.invalid then formClasses.push('is-invalid-form')

    if not TaskPlanStore.isVisibleToStudents()
      addReadingsButton = <BS.Button id='reading-select'
        onClick={@showSectionTopics}
        bsStyle='default'>+ {addReadingText}
      </BS.Button>

    <div className='reading-plan'>
      <BS.Panel bsStyle='primary'
        className={formClasses.join(' ')}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />

          <BS.Row>
            <BS.Col xs={12} md={12}>
              <ReviewReadings courseId={courseId} planId={id} selected={topics}/>
              {addReadingsButton}
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      {selectReadings}
    </div>

module.exports = {ReadingPlan}
