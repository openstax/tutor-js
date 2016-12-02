React = require 'react'

BS = require 'react-bootstrap'
classnames = require 'classnames'

LoadableItem = require '../../loadable-item'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
Editor = require './editor'

TaskPlanMiniEditorShell = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    planId:   React.PropTypes.string.isRequired
    onHide:   React.PropTypes.func.isRequired
    findPopOverTarget: React.PropTypes.func.isRequired
    position: React.PropTypes.shape(
      x: React.PropTypes.number
      y: React.PropTypes.number
    )

  getInitialState: ->
    isVisible: true

  handleError: (error) ->
    @setState({error})

  renderEditor: ->
    <Editor
      id={@props.planId}
      onHide={@props.onHide}
      courseId={@props.courseId}
      termStart={@props.termStart}
      termEnd={@props.termEnd}
      save={TaskPlanActions.saveSilent}
      handleError={@handleError}
    />

  calculatePlacement: ->
    # currently we use fixed positioning.
    # May adjust based on "position" prop at some point
    'top'

  render: ->
    {planId, courseId} = @props
    popoverClasses = classnames('mini-task-editor-popover',
      'is-errored': @state.error
    )

    <div className="task-plan-mini-editor">

      <BS.Overlay
        show={@state.isVisible}
        onHide={@props.onHide}
        placement={@calculatePlacement()}
        ref='overlay'
        target={@props.findPopOverTarget}
      >

        <BS.Popover id='mini-task-editor-popover'
          className={popoverClasses}
        >

          <LoadableItem
            id={planId}
            store={TaskPlanStore}
            actions={TaskPlanActions}
            renderItem={@renderEditor}
          />

        </BS.Popover>

      </BS.Overlay>
    </div>



module.exports = TaskPlanMiniEditorShell
