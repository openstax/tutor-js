React = require 'react'
_ = require 'underscore'

Dialog = require '../dialog'
LoadableItem = require '../loadable-item'
{TocStore, TocActions} = require '../../flux/toc'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{CourseStore} = require '../../flux/course'
SectionsChooser = require '../sections-chooser'
LoadableItem = require '../loadable-item'

SelectTopics = React.createClass
  displayName: 'SelectTopics'
  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    onSectionChange: React.PropTypes.func.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array
    header: React.PropTypes.string.isRequired
    cancel: React.PropTypes.func.isRequired

  getInitialState: -> {initialSelected: @props.selected}

  hasChanged: ->
    @props.selected and not _.isEqual(@props.selected, @state.initialSelected)

  onSectionChange: (sectionIds) ->
    TaskPlanActions.updateTopics(@props.planId, sectionIds)
    @props.onSectionChange?(sectionIds)

  renderDialog: ->
    {courseId, planId, selected, hide, header, primary, cancel, ecosystemId} = @props

    <Dialog
      className='select-topics'
      header={header}
      primary={primary}
      confirmMsg='You will lose unsaved changes if you continue.'
      cancel='Cancel'
      isChanged={_.constant(@hasChanged())}
      onCancel={cancel}>

      <div className='select-chapters' data-ecosystem-id={ecosystemId}>
        <SectionsChooser
          ecosystemId={ecosystemId}
          chapters={TocStore.get(ecosystemId)}
          selectedSectionIds={TaskPlanStore.getTopics(planId)}
          onSelectionChange={@onSectionChange}
        />
      </div>

    </Dialog>

  render: ->

    <LoadableItem
      id={@props.ecosystemId}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderDialog}
    />


module.exports = SelectTopics
