React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
LoadableMixin = require '../loadable-mixin'
ConfirmLeaveMixin = require '../confirm-leave-mixin'

# For transitions, perform them after React event handling
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
    TocActions.load()
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
  render: ->
    classes = []
    classes.push('disabled') unless @props.onSave
    classes = classes.join(' ')

    if @props.onPublish
      publishButton = <BS.Button bsStyle="primary" onClick={@props.onPublish}>Publish</BS.Button>
      saveStyle = "link"
    else
      saveStyle = "primary"

    if @props.onDelete
      deleteLink = <BS.Button bsStyle="link" onClick={@props.onDelete}>Delete</BS.Button>

    saveLink = <BS.Button bsStyle={saveStyle} className={classes} onClick={@props.onSave}>Save as Draft</BS.Button>

    <span>
      {publishButton}
      {saveLink}
      {deleteLink}
    </span>



ReadingPlan = React.createClass
  mixins: [Router.State, Router.Navigation, LoadableMixin, ConfirmLeaveMixin]

  getInitialState: ->
    {id} = @getParams()
    if (id)
      TaskPlanActions.load(id)
    else
      id = TaskPlanStore.freshLocalId()
      TaskPlanActions.create(id, due_at: new Date())
    {id}

  getId: -> @getParams().id or @state.id
  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  # If, as a result of a save creating a new object (and providing an id)
  # then transition to editing the object
  update: ->
    id = @getId()
    if TaskPlanStore.isNew(id) and TaskPlanStore.get(id).id
      {id} = TaskPlanStore.get(id)
      delay => @transitionTo('editReading', {id})
    else
      @setState({})

  setDueAt: (value) ->
    id = @getId()
    TaskPlanActions.updateDueAt(id, value)

  setTitle: ->
    id = @getId()
    value = @refs.title.getDOMNode().value
    TaskPlanActions.updateTitle(id, value)

  savePlan: ->
    id = @getId()
    TaskPlanActions.save(id)

  publishPlan: ->
    id = @getId()
    TaskPlanActions.publish(id)

  deletePlan: () ->
    id = @getId()
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @transitionTo('dashboard')

  renderLoaded: ->
    id = @getId()
    plan = TaskPlanStore.get(id)

    valid = plan?.title and plan?.due_at and plan?.settings?.page_ids?.length > 0
    publishable = valid and not TaskPlanStore.isChanged(id)
    saveable = valid and TaskPlanStore.isChanged(id)

    deleteable = not TaskPlanStore.isNew(id)
    headerText = if TaskPlanStore.isNew(id) then 'Add Reading' else 'Edit Reading'
    topics = TaskPlanStore.getTopics(id)

    footer= <ReadingFooter
              onSave={@savePlan if saveable}
              onPublish={@publishPlan if publishable}
              onDelete={@deletePlan if deleteable}/>

    <BS.Panel bsStyle="default" className="create-reading" footer={footer}>
      <h1>{headerText}</h1>
      <div>
        <label htmlFor="reading-title">Title</label>
        <input
          ref="title"
          id="reading-title"
          type="text"
          value={plan.title}
          placeholder="Enter Title"
          onChange={@setTitle} />
      </div>
      <div>
        <label htmlFor="reading-due-date">Due Date</label>
        <DateTimePicker
          id="reading-due-date"
          format="MMM dd, yyyy"
          time={false}
          calendar={true}
          readOnly={false}
          onChange={@setDueAt}
          value={new Date(plan?.due_at)}/>
      </div>
      <SelectTopics planId={id} selected={topics}/>
    </BS.Panel>

module.exports = ReadingPlan
