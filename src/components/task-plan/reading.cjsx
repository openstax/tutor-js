React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
SelectTopics = require './select-topics'
PlanFooter = require './footer'
LoadableItem = require '../loadable-item'
ConfirmLeaveMixin = require '../confirm-leave-mixin'

ReviewReadings = React.createClass
  displayName: 'ReviewReadings'
  propTypes:
    selected: React.PropTypes.array

  renderSection: (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    <li className='-selected-section'>
      <span className='-section-number'>{topic?.number}</span>
      <span className='-section-title'>{topic?.title}</span>
    </li>

  renderSelected: ->
    if @props.selected.length
      <ul className='selected-reading-list'>
        <li><strong>Currently selected sections in this reading</strong></li>
        {_.map(@props.selected, @renderSection)}
      </ul>
    else
      <div className='-selected-reading-list-none'>No Readings Selected Yet</div>

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

  setOpensAt: (value) ->
    {id} = @props
    TaskPlanActions.updateOpensAt(id, value)

  setDueAt: (value) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value)

  setTitle: ->
    {id} = @props
    value = @refs.title.getDOMNode().value
    TaskPlanActions.updateTitle(id, value)

  showSectionTopics: ->
    @setState({
      showSectionTopics: true
    })

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    headerText = if TaskPlanStore.isNew(id) then 'Add Reading' else 'Edit Reading'
    topics = TaskPlanStore.getTopics(id)
    formClasses = ['create-reading']

    if TaskPlanStore.isNew(id) and @context?.router?.getCurrentQuery().date
      plan.due_at = new Date(@context.router.getCurrentQuery().date)

    # Restrict the due date to be after the open date
    # and restrict the open date to be before the due date
    if plan?.opens_at
      opensAt = new Date(plan.opens_at)
    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer = <PlanFooter id={id} courseId={courseId} />

    if (@state?.showSectionTopics)
      formClasses.push('hide')
      selectReadings = <ChooseReadings
                        hide={@hideSectionTopics}
                        courseId={courseId} 
                        planId={id} 
                        selected={topics}/>

    <div className='-reading-container'>
      <BS.Panel bsStyle='primary' 
        className={formClasses.join(' ')} 
        footer={footer} 
        header={headerText}>

        <div className='-reading-title'>
          <label htmlFor='reading-title'>Title</label>
          <input
            ref='title'
            id='reading-title'
            type='text'
            value={plan.title}
            placeholder='Enter Title'
            onChange={@setTitle} />
        </div>
        <div className='-reading-open-date'>
          <label htmlFor='reading-open-date'>Open Date</label>
          <DateTimePicker
            id='reading-open-date'
            format='MMM dd, yyyy'
            time={false}
            calendar={true}
            readOnly={false}
            onChange={@setOpensAt}
            max={dueAt}
            value={opensAt}/>
        </div>
        <div className='-reading-due-date'>
          <label htmlFor='reading-due-date'>Due Date</label>
          <DateTimePicker
            id='reading-due-date'
            format='MMM dd, yyyy'
            time={false}
            calendar={true}
            readOnly={false}
            onChange={@setDueAt}
            min={opensAt}
            value={dueAt}/>
        </div>
        <div>
          <label htmlFor='reading-select'>Select Readings</label>
          <BS.Button id='reading-select' 
            onClick={@showSectionTopics} 
            bsStyle='primary'>Edit Readings
          </BS.Button>
          <ReviewReadings courseId={courseId} selected={topics}/>
        </div>
      </BS.Panel>
      {selectReadings}
    </div>

module.exports = {ReadingPlan}


