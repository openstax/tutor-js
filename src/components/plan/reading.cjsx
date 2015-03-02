React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
Datepicker = (require 'react-widgets').DateTimePicker

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

SelectReadings = React.createClass
  mixins: [BS.OverlayMixin],
  getInitialState: -> {
    isModalOpen: false
  }

  handleToggle: ->
    @setState({
      isModalOpen: !@state.isModalOpen
    })

  doneWithSelection: ->
    return

  render: ->
    <BS.Button onClick={@handleToggle} bsStyle="primary">Edit Readings</BS.Button>

  renderOverlay: ->
    if !@state.isModalOpen
      return <span/>

    <BS.Modal backdrop={true} onRequestHide=@doneWithSelection>
      <div className="modal-body">
        <ul>
          <li>List</li>
          <li>of</li>
          <li>chapters</li>
          <li>and</li>
          <li>sections</li>
        </ul>
      </div>
      <div className="modal-footer">
        <BS.Button onClick={@handleToggle}>Close</BS.Button>
      </div>
    </BS.Modal>

ReadingPlan = React.createClass
  mixins: [Router.State]

  getInitialState: ->
    {id: @getParams().id}

  componentWillMount: ->
    # Fetch the task if it has not been loaded yet
    TaskPlanStore.addChangeListener(@update)

  componentWillUnmount: ->
    TaskPlanStore.removeChangeListener(@update)

  update: ->
    @setState({})

  setDueAt: (value) ->
    TaskPlanActions.updateDueAt(@state.id, value)

  setTitle: (value) ->
    TaskPlanActions.updateTitle(@state.id, value)

  render: ->
    id = @getParams().id
    footer = <BS.Button bsStyle="primary">Publish</BS.Button>
    headerText = if id then 'Edit Reading' else 'Add Reading'
    dueDate = if @state.due_at then @state.due_at else @props.due_at

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
        <SelectReadings/>
      </p>
    </BS.Panel>

module.exports = ReadingPlan
