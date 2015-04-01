React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
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

ReadingFooter = React.createClass

  contextTypes:
    router: React.PropTypes.func

  onSave: ->
    {id} = @props
    TaskPlanActions.save(id)

  onPublish: ->
    {id} = @props
    TaskPlanActions.publish(id)

  onDelete: () ->
    {id} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @context.router.transitionTo('dashboard')

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    valid = TaskPlanStore.isValid(id)
    publishable = valid and not TaskPlanStore.isChanged(id)
    saveable = valid and TaskPlanStore.isChanged(id)
    deleteable = not TaskPlanStore.isNew(id)

    classes = ['-publish']
    classes.push('disabled') unless publishable
    classes = classes.join(' ')

    publishButton = <BS.Button bsStyle="link" className={classes} onClick={@onPublish}>Publish</BS.Button>

    if deleteable
      deleteLink = <BS.Button bsStyle="link" className="-delete" onClick={@onDelete}>Delete</BS.Button>

    classes = ['-save']
    classes.push('disabled') unless saveable
    classes = classes.join(' ')

    saveLink = <BS.Button bsStyle="primary" className={classes} onClick={@onSave}>Save as Draft</BS.Button>

    statsLink = <BS.Button bsStyle="link" className="-stats" onClick={@onViewStats}>Stats</BS.Button>

    <span className="-footer-buttons">
      {saveLink}
      {publishButton}
      {deleteLink}
      {statsLink}
    </span>



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

    footer= <ReadingFooter id={id} courseId={courseId} />

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


ReadingShell = React.createClass
  mixins: [LoadableMixin, ConfirmLeaveMixin]

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {courseId, id} = @context.router.getCurrentParams()
    if (id)
      TaskPlanActions.load(id)
    else
      id = TaskPlanStore.freshLocalId()
      TaskPlanActions.create(id, {_HACK_courseId: courseId})
    {id}

  getId: -> @context.router.getCurrentParams().id or @state.id
  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  # If, as a result of a save creating a new object (and providing an id)
  # then transition to editing the object
  update: ->
    id = @getId()
    if TaskPlanStore.isNew(id) and TaskPlanStore.get(id).id
      {id} = TaskPlanStore.get(id)
      {courseId} = @context.router.getCurrentParams()
      delay => @context.router.transitionTo('editReading', {courseId, id})
    else
      @setState({})

  renderLoaded: ->
    id = @getId()
    {courseId} = @context.router.getCurrentParams()

    <ReadingPlan id={id} courseId={courseId} />

module.exports = {ReadingShell, ReadingPlan}
