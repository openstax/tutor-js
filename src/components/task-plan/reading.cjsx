React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'

SectionTopic = React.createClass
  toggleSection:->
    @props.toggleSection(@props.section)

  render: ->
    classes = ['section']
    classes.push('selected') if @props.active

    <div key={@props.section.id} className = {classes.join(' ')} onClick={@toggleSection}>
      <span className="number">{@props.section.number}</span> -
      <span className="title">{@props.section.title}</span>
    </div>

SelectTopics = React.createClass
  mixins: [BS.OverlayMixin],
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
    if (@props.selected.length and TocStore.isLoaded())
      selectedReadingList =
        <ul className="selected-reading-list">
          <li><strong>Currently selected sections in this reading</strong></li>
          {_.map(@props.selected, @renderTopics)}
        </ul>
    else
      selectedReadingList = <div className="loading">Loading...</div>

    <div>
      <label>Select Readings</label>
      <BS.Button onClick={@handleToggle} bsStyle="primary">Edit Readings</BS.Button>
      {selectedReadingList}
    </div>

  renderTopics: (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    <li>{topic.number} - {topic.title}</li>

  toggleSection: (section) ->
    if (TaskPlanStore.hasTopic(@props.planId, section.id))
      TaskPlanActions.removeTopic(@props.planId, section.id)
    else
      TaskPlanActions.addTopic(@props.planId, section.id)

  renderSections: (section) ->
    active = TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} toggleSection={@toggleSection}/>

  renderChapterPanels: (chapter, i) ->
    sections = _.map(chapter.children, @renderSections)
    header =
      <h2 className="chapter-title">
        <span className="number">{chapter.number}</span>.
        <span className="title">{chapter.title}</span>
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

    <BS.Modal backdrop={true} onRequestHide=@doneWithSelection>
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
    classes.push('disabled') unless @props.enabled
    classes = classes.join(' ')

    deleteLink = <a onClick={@props.onDelete}>Delete this plan</a> if @props.enabled

    <span>
      <BS.Button bsStyle="primary" className={classes} onClick={@props.onPublish}>Publish</BS.Button>
      {deleteLink}
    </span>

ReadingPlan = React.createClass
  mixins: [Router.State, Router.Navigation]

  getInitialState: ->
    id = @getParams().id
    if (id)
      TaskPlanActions.load(id)
    else
      id = TaskPlanStore.freshLocalId()
      plan = TaskPlanActions.create(id, due_at: new Date())

    {id}

  componentWillMount: -> TaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TaskPlanStore.removeChangeListener(@update)

  getPlanId: () ->
    @getParams().id or @state.id

  update: () ->
    id = @getPlanId()
    plan = TaskPlanStore.get(id)
    if (id isnt plan.id)
      @setState({id: plan.id})
    else
      @setState {}

  setDueAt: (value) ->
    id = @getPlanId()
    TaskPlanActions.updateDueAt(id, value)

  setTitle: ->
    id = @getPlanId()
    value = @refs.title.getDOMNode().value
    TaskPlanActions.updateTitle(id, value)

  publishPlan: ->
    id = @getPlanId()
    TaskPlanActions.publish(id)
    @transitionTo('editReading', {id})

  deletePlan: () ->
    id = @getPlanId()
    @transitionTo('dashboard')
    TaskPlanActions.delete(id)

  render: ->
    id = @getPlanId()

    unless TaskPlanStore.isLoaded(id)
      <div className="loading">Loading...</div>

    plan = TaskPlanStore.get(id)

    isEnabled = plan?.title and plan?.due_at and plan?.settings?.page_ids?.length > 0

    headerText = if id then 'Edit Reading' else 'Add Reading'
    topics = TaskPlanStore.getTopics(id)
    
    footer= <ReadingFooter enabled={isEnabled} onPublish={@publishPlan} onDelete={@deletePlan}/>

    <BS.Panel bsStyle="default" className="create-reading" footer={footer}>
      <h1>{headerText}</h1>
      <div>
        <label htmlFor="reading-title">Name</label>
        <input ref="title" id="reading-title" type="text" onChange={@setTitle} value={plan?.title}/>
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
