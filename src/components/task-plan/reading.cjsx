React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
SelectTopics = require './select-topics'
PlanFooter = require './footer'
ChapterSection = require './chapter-section'
LoadableItem = require '../loadable-item'
ConfirmLeaveMixin = require '../confirm-leave-mixin'

ReviewReadingLi = React.createClass
  displayName: 'ReviewReadingLi'
  propTypes:
    planId: React.PropTypes.string.isRequired
    topicId: React.PropTypes.string.isRequired

  removeTopic: ->
    TaskPlanActions.removeTopic(@props.planId, @props.topicId)

  render: ->

    topic = TocStore.getSectionInfo(@props.topicId)

    <li className='-selected-section'>
      <ChapterSection section={topic.chapter_section}/>
      <span className='section-title'>{topic?.title}</span>
      <BS.Button className="remove-topic" onClick={@removeTopic} bsStyle="default">X</BS.Button>
    </li>

ReviewReadings = React.createClass
  displayName: 'ReviewReadings'
  propTypes:
    planId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array

  renderSection: (topicId) ->
    <ReviewReadingLi topicId={topicId} planId={@props.planId}/>

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

  render: ->
    buttonStyle = if @props.selected?.length then 'primary' else 'disabled'
    header = <span>Select Readings</span>

    primary =
      <BS.Button
        className='-show-problems'
        bsStyle={buttonStyle}
        onClick={@props.hide}>Add Readings
      </BS.Button>

    <SelectTopics
      primary={primary}
      header={header}
      courseId={@props.courseId}
      planId={@props.planId}
      selected={@props.selected}
      hide={@props.hide} />

ReadingPlan = React.createClass

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    if TaskPlanStore.isNew(@props.id) and @context?.router?.getCurrentQuery().date
      #firefox doesn't like dates with dashes in them
      dateStr = @context.router.getCurrentQuery().date.replace(/-/g, ' ')
      dueAt = new Date(dateStr)
      @setDueAt(dueAt)
    {}

  setOpensAt: (value) ->
    {id} = @props
    TaskPlanActions.updateOpensAt(id, value)

  setDueAt: (value) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value)

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  showSectionTopics: ->
    @setState({
      showSectionTopics: true
    })

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  cancel: ->
    {id} = @props
    TaskPlanActions.reset(id)
    @context.router.transitionTo('dashboard')

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    headerText = if TaskPlanStore.isNew(id) then 'Add Reading Assignment' else 'Edit Reading Assignment'
    topics = TaskPlanStore.getTopics(id)
    formClasses = ['edit-reading', 'dialog']
    closeBtn = <BS.Button 
      className='pull-right close-icon' 
      aria-role='close' 
      onClick={@cancel}>
        <i className="fa fa-close"></i>
    </BS.Button>

    # Restrict the due date to be after the open date
    # and restrict the open date to be before the due date
    opensAt = TaskPlanStore.getOpensAt(id)

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer = <PlanFooter id={id} courseId={courseId} />
    header = [headerText, closeBtn]
    
    addReadingText = if topics?.length then 'Add More Readings' else 'Add Readings'

    if (@state?.showSectionTopics)
      formClasses.push('hide')
      selectReadings = <ChooseReadings
                        hide={@hideSectionTopics}
                        courseId={courseId}
                        planId={id}
                        selected={topics}/>
    <div className='reading-plan'>
      <BS.Panel bsStyle='primary'
        className={formClasses.join(' ')}
        footer={footer}
        header={header}>

        <BS.Grid>
          <BS.Row>
            <BS.Col xs={12} md={8}>
              <TutorInput
                label='Name'
                id='reading-title'
                default={plan.title}
                onChange={@setTitle} />
            </BS.Col>
            <BS.Col xs={12} md={4}>
              <TutorDateInput
                id='reading-due-date'
                className="form-control"
                label='Due Date'
                format='MMM dd, yyyy'
                time={false}
                calendar={true}
                readOnly={false}
                onChange={@setDueAt}
                min={opensAt}
                value={dueAt}/>
            </BS.Col>
            <BS.Col xs={12} md={12}>
              <ReviewReadings courseId={courseId} planId={id} selected={topics}/>
              <BS.Button id='reading-select'
                onClick={@showSectionTopics}
                bsStyle='default'>+ {addReadingText}
              </BS.Button>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      {selectReadings}
    </div>

module.exports = {ReadingPlan}
