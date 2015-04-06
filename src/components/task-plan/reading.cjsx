React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'

PlanFooter = require './footer'
LoadableMixin = require '../loadable-mixin'
ConfirmLeaveMixin = require '../confirm-leave-mixin'

# Transitions need to be delayed so react has a chance to finish rendering so delay them
delay = (fn) -> setTimeout(fn, 1)

SectionTopic = React.createClass
  render: ->
    classes = ['section']
    classes.push('selected') if @props.active
    classes = classes.join(' ')

    <div key={@props.section.id} className={classes} onClick={@toggleSection}>
      <span className="-section-number">{@props.section.number}</span>
      <span className="-section-title">{@props.section.title}</span>
    </div>

  toggleSection: ->
    section = @props.section
    if (TaskPlanStore.hasTopic(@props.planId, section.id))
      TaskPlanActions.removeTopic(@props.planId, section.id)
    else
      TaskPlanActions.addTopic(@props.planId, section.id)


SelectTopics = React.createClass
  mixins: [BS.OverlayMixin]
  getInitialState: ->
    {courseId} = @props
    TocActions.load(courseId) unless TocStore.isLoaded()
    { isModalOpen: false }

  componentWillMount:   -> TocStore.addChangeListener(@update)
  componentWillUnmount: -> TocStore.removeChangeListener(@update)

  update: -> @setState({})

  handleToggle: ->
    @setState({
      isModalOpen: !@state.isModalOpen
    })

  doneWithSelection: ->
    return

  render: ->
    if TocStore.isLoaded()
      if @props.selected.length
        selectedReadingList =
          <ul className="selected-reading-list">
            <li><strong>Currently selected sections in this reading</strong></li>
            {_.map(@props.selected, @renderTopics)}
          </ul>
      else
        selectedReadingList = <div className="-selected-reading-list-none">No Readings Selected Yet</div>

      <div>
        <label htmlFor="reading-select">Select Readings</label>
        <BS.Button id="reading-select" onClick={@handleToggle} bsStyle="primary">Edit Readings</BS.Button>
        {selectedReadingList}
      </div>

    else
      <div className="-loading">Loading...</div>


  renderTopics: (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    <li className="-selected-section">
      <span className="-section-number">{topic.number}</span>
      <span className="-section-title">{topic.title}</span>
    </li>

  renderSections: (section) ->
    active = TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} planId={@props.planId} />

  renderChapterPanels: (chapter, i) ->
    sections = _.map(chapter.children, @renderSections)
    header =
      <h2 className="-chapter-title">
        <span className="-chapter-number">{chapter.number}</span>
        <span className="-chapter-title">{chapter.title}</span>
      </h2>

    <BS.Accordion>
      <BS.Panel key={chapter.id} header={header} eventKey={chapter.id}>
        {sections}
      </BS.Panel>
    </BS.Accordion>

  renderOverlay: ->
    unless @state.isModalOpen
      return <span className="-no-modal"/>
    unless TocStore.isLoaded()
      TocActions.load()
      return <span className="-loading">Loading...</span>

    chapters = _.map(TocStore.get(), @renderChapterPanels)

    <BS.Modal backdrop={true} onRequestHide={@doneWithSelection}>
      <div className="modal-body select-reading-modal">
        {chapters}
      </div>
      <div className="modal-footer">
        <BS.Button onClick={@handleToggle}>Close</BS.Button>
      </div>
    </BS.Modal>


ReadingPlan = React.createClass

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

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    headerText = if TaskPlanStore.isNew(id) then 'Add Reading' else 'Edit Reading'
    topics = TaskPlanStore.getTopics(id)

    # Restrict the due date to be after the open date
    # and restrict the open date to be before the due date
    if plan?.opens_at
      opensAt = new Date(plan.opens_at)
    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer= <PlanFooter id={id} courseId={courseId} />

    <BS.Panel bsStyle="default" className="create-reading" footer={footer}>
      <h1>{headerText}</h1>
      <div className="-reading-title">
        <label htmlFor="reading-title">Title</label>
        <input
          ref="title"
          id="reading-title"
          type="text"
          value={plan.title}
          placeholder="Enter Title"
          onChange={@setTitle} />
      </div>
      <div className="-reading-open-date">
        <label htmlFor="reading-open-date">Open Date</label>
        <DateTimePicker
          id="reading-open-date"
          format="MMM dd, yyyy"
          time={false}
          calendar={true}
          readOnly={false}
          onChange={@setOpensAt}
          max={dueAt}
          value={opensAt}/>
      </div>
      <div className="-reading-due-date">
        <label htmlFor="reading-due-date">Due Date</label>
        <DateTimePicker
          id="reading-due-date"
          format="MMM dd, yyyy"
          time={false}
          calendar={true}
          readOnly={false}
          onChange={@setDueAt}
          min={opensAt}
          value={dueAt}/>
      </div>
      <SelectTopics courseId={courseId} planId={id} selected={topics}/>
    </BS.Panel>

module.exports = {ReadingPlan}
