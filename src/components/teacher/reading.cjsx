React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DatePicker} = require 'react-widgets'

{TaskPlanActions, TaskPlanStore} = require '../../flux/task-plan'

SelectReadings = React.createClass
  mixins: [BS.OverlayMixin],
  getInitialState: -> {
    isModalOpen: false
  }

  handleToggle: ->
    @setState({
      isModalOpen: !@state.isModalOpen
    })

  render: ->
    <BS.Button onClick={@handleToggle} bsStyle="primary">Edit Readings</BS.Button>

  renderOverlay: ->
    if !@state.isModalOpen
      return <span/>

    <BS.Modal backdrop={true}>
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

Reading = React.createClass
  mixins: [Router.State]
  getInitialState: -> {title: '', state: 'draft', topics: [], due_at: null}
  getDefaultProps: -> {title: '', state: 'draft', topics: [], due_at: null}
  componentWillMount: ->
    # Fetch the task if it has not been loaded yet
    id = @getParams().id
    # leave flux stuff to phil
    # if ReadingStore.isUnknown(id)
    #  ReadingActions.load(id)

  setDueAt: (value) ->
    @setState({
      due_at: value
    })

  render: ->
    id = @getParams().id
    footer = <BS.Button bsStyle="primary">Publish</BS.Button>
    headerText = if id then 'Edit Reading' else 'Add Reading'
    dueDate = if @state.due_at then @state.due_at else @props.due_at

    <BS.Panel bsStyle="default" className="create-reading" footer={footer}>
      <h1>{headerText}</h1>
      <div>
        <label htmlFor="title">Name</label>
        <input id="title" type="text" value={@props.title}/>
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

module.exports = Reading
