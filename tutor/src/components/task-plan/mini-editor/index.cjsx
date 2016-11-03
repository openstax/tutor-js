React = require 'react'

BS = require 'react-bootstrap'

LoadableItem = require '../../loadable-item'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
Editor = require './editor'

TaskPlanMiniEditorShell = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    planId:   React.PropTypes.string.isRequired
    onHide: React.PropTypes.func.isRequired
    findPopOverTarget: React.PropTypes.func.isRequired

  getInitialState: ->
    isVisible: true

  renderEditor: ->
    <Editor
      id={@props.planId}
      onHide={@props.onHide}
      courseId={@props.courseId}
    />

  render: ->
    {planId, courseId} = @props

    <div className="task-plan-mini-editor">

      <BS.Overlay
        show={@state.isVisible}
        onHide={@props.onHide}
        placement='left'
        ref='overlay'
        target={@props.findPopOverTarget}
      >

        <BS.Popover id='mini-task-editor-popover'
          className="mini-task-editor-popover"
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
