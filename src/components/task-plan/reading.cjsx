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
      <span class="number">{@props.section.number}</span> -
      <span class="title">{@props.section.title}</span>
    </div>

SelectTopics = React.createClass
  mixins: [BS.OverlayMixin],
  getInitialState: -> { isModalOpen: false }

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
    <BS.Button onClick={@handleToggle} bsStyle="primary">Edit Readings</BS.Button>

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
      <h2 class="chapter-title">
        <span class="number">{chapter.number}</span>.
        <span class="title">{chapter.title}</span>
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


ReadingPlan = React.createClass
  mixins: [Router.State]

  getInitialState: ->
    if (@getParams().id)
      return {id: @getParams().id}
    else
      TaskPlanActions.create()
      return {id: TaskPlanStore.getCreateKey()}

  componentWillMount: -> TaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TaskPlanStore.removeChangeListener(@update)

  update: ->
    @setState({
      id: @state.id,
      topics: TaskPlanStore.getTopics(@state.id)
    })

  setDueAt: (value) ->
    TaskPlanActions.updateDueAt(@state.id, value)

  setTitle: (value) ->
    TaskPlanActions.updateTitle(@state.id, value)

  savePlan: ->
    TaskPlanActions.save(@state.id)

  renderTopics: (topicId) ->
    <li>{TocStore.getSectionInfo(topicId).title}</li>

  render: ->
    id = @getParams().id
    footer = <BS.Button bsStyle="primary">Publish</BS.Button>
    headerText = if id then 'Edit Reading' else 'Add Reading'
    dueDate = if @state.due_at then @state.due_at else @props.due_at
    topics = TaskPlanStore.getTopics(@state.id)

    <BS.Panel bsStyle="default" className="create-reading" footer={footer}>
      <h1>{headerText}</h1>
      <div>
        <label htmlFor="title">Name</label>
        <input id="title" type="text" onChange={@setTitle} value={@props.title}/>
      </div>
      <div>
        <label htmlFor="due-date">Due Date</label>
        <DateTimePicker
          id="due-date"
          format="MMM dd, yyyy"
          time={false}
          calendar={true}
          readOnly={false}
          onChange={@setDueAt}
          value={dueDate}/>
      </div>
      <p>
        <label>Select Readings</label>
        <SelectTopics planId={@state.id} selected={topics}/>
      </p>
      <ul>
        {_.map(topics, @renderTopics)}
      </ul>
    </BS.Panel>

module.exports = ReadingPlan
