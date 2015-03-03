React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
Datepicker = (require 'react-widgets').DateTimePicker

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

SectionTopic = React.createClass
  toggleSection:->
    @props.toggleSection(@props.section)
    
  render: ->
    isActive = 'info' if @props.active
    <BS.ListGroupItem 
      key={@props.section.id} 
      bsStyle= {isActive}
      onClick={@toggleSection}>{@props.section.number}. {@props.section.title}</BS.ListGroupItem>

SelectTopics = React.createClass
  mixins: [BS.OverlayMixin],
  getInitialState: -> { isModalOpen: false }

  getInitialState: ->
    {
      chapters: [
        {
          title: "Kinematics",
          number: "1",
          id: 123,
          children: [{
            title: "Kinematics in 1 dim",
            number: "1.1",
            id: 234
          }, {
            title: "Kinematics in 2 dim",
            number: "1.2",
            id: 235
          }, {
            title: "Kinematics in 3 dim",
            number: "1.3",
            id: 236
          }],
        },
        {
          title: "Mechanics",
          number: "2",
          id: 124,
          children: [{
            title: "Mechanics in 1 dim",
            number: "2.1",
            id: 237
          }, {
            title: "Mechanics in 2 dim",
            number: "2.2",
            id: 238
          }, {
            title: "Mechanics in 3 dim",
            number: "2.3",
            id: 239
          }],

        },
        {
          title: "Thermodynamics",
          number: "3",
          id: 125,
          children: [{
            title: "Thermodynamics in 1 dim",
            number: "3.1",
            id: 240
          }, {
            title: "Thermodynamics in 2 dim",
            number: "3.2",
            id: 241
          }, {
            title: "Thermodynamics in 3 dim",
            number: "3.3",
            id: 242
          }]
        }
      ]
    }

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
    sections = _.map(chapter.children, _.bind(@renderSections, this))
    header = <h2>{chapter.number}. {chapter.title}</h2>

    <BS.Panel key={chapter.id} header={header} eventKey={chapter.id}>
      <BS.ListGroup>
        {sections}
      </BS.ListGroup>
    </BS.Panel>

  renderOverlay: ->
    if !@state.isModalOpen
      return <span/>
  
    chapters = _.map(@state.chapters, _.bind(@renderChapterPanels, this))

    <BS.Modal backdrop={true} onRequestHide=@doneWithSelection>
      <div className="modal-body">
        <BS.Accordion>
          {chapters}
        </BS.Accordion>
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

  renderTopics: (topic) ->
    <li>{topic}</li>

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
        <Datepicker
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
