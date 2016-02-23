React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Dialog = require '../dialog'
LoadableItem = require '../loadable-item'
{TocStore, TocActions} = require '../../flux/toc'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{CourseStore} = require '../../flux/course'


SelectTopics = React.createClass
  displayName: 'SelectTopics'
  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array

  getInitialState: -> {initialSelected: @props.selected}

  renderChapterPanels: (chapter, i) ->
    expanded = not @props.selected?.length and i is 0
    <ChapterAccordion {...@props} expanded={expanded} chapter={chapter}/>

  hasChanged: ->
    @props.selected and not _.isEqual(@props.selected, @state.initialSelected)

  renderDialog: ->
    {courseId, planId, selected, hide, header, primary, cancel} = @props

    selected = TaskPlanStore.getTopics(planId)
    chapters = _.map(TocStore.get(@props.ecosystemId), @renderChapterPanels)
    changed = @hasChanged()

    <Dialog
      className='select-reading-dialog'
      header={header}
      primary={primary}
      confirmMsg='You will lose unsaved changes if you continue.'
      cancel='Cancel'
      isChanged={-> changed}
      onCancel={cancel}>

      <div className='select-reading-chapters'>
        {chapters}
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
