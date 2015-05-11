React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Dialog = require '../dialog'
LoadableItem = require '../loadable-item'
{TocStore, TocActions} = require '../../flux/toc'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
ChapterSection = require './chapter-section'

SectionTopic = React.createClass
  displayName: 'SectionTopic'

  propTypes:
    planId: React.PropTypes.string.isRequired
    section: React.PropTypes.object.isRequired
    active: React.PropTypes.bool

  render: ->
    classes = ['section']
    classes.push('selected') if @props.active
    isChecked = 'checked' if @props.active
    classes = classes.join(' ')

    <div key={@props.section.id} className={classes} onClick={@toggleSection}>
      <span className='section-checkbox'>
        <input type='checkbox' checked={isChecked}/>
      </span>
      <ChapterSection section={@props.section.chapter_section}/>.
      <span className='-section-title'> {@props.section.title}</span>
    </div>

  toggleSection: ->
    section = @props.section
    if (TaskPlanStore.hasTopic(@props.planId, section.id))
      TaskPlanActions.removeTopic(@props.planId, section.id)
    else
      TaskPlanActions.addTopic(@props.planId, section.id)

ChapterAccordion = React.createClass
  displayName: 'ChapterAccordion'

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    chapter: React.PropTypes.object.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array

  renderSections: (section) ->
    active = TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} planId={@props.planId} />

  areAllSectionsSelected: (allSelected, section) ->
    @props.selected.indexOf(section.id) >= 0 and allSelected

  toggleAllSections: (e) ->
    if e.target.checked
      action = TaskPlanActions.addTopic
    else
      action = TaskPlanActions.removeTopic

    planId = @props.planId
    _.each @props.chapter.children, (section) ->
      action(planId, section.id)

  areAnySectionsSelected: (anySelected, section) ->
    @props.selected.indexOf(section.id) >= 0 or anySelected

  render: ->
    chapter = @props.chapter
    sections = _.map(chapter.children, @renderSections)
    allChecked = _.reduce(chapter.children, @areAllSectionsSelected, true)
    expandAccordion = _.reduce(chapter.children, @areAnySectionsSelected, true) or @props.i is 0
    activeKey = chapter.id if expandAccordion

    header =
      <h2 className='-chapter-title'>
        <span className='chapter-checkbox'>
          <input type='checkbox' id="chapter-checkbox-#{chapter.id}"
            onChange={@toggleAllSections} checked={allChecked}/>
        </span>
        <span className='-chapter-number'>
          Chapter <ChapterSection section={chapter.chapter_section}/> -
        </span>
        <span className='-chapter-title'> {chapter.title}</span>
      </h2>

    <BS.Accordion activeKey={activeKey}>
      <BS.Panel key={chapter.id} header={header} eventKey={chapter.id}>
        {sections}
      </BS.Panel>
    </BS.Accordion>

SelectTopics = React.createClass
  displayName: 'SelectTopics'
  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array

  renderChapterPanels: (chapter, i) ->
    <ChapterAccordion {...@props} chapter={chapter}/>

  renderDialog: ->
    {courseId, planId, selected, hide, header, primary} = @props

    selected = TaskPlanStore.getTopics(planId)
    chapters = _.map(TocStore.get(), @renderChapterPanels)

    <Dialog
      className='my-dialog-class'
      header={header}
      primary={primary}
      confirmMsg='Are you sure you want to close?'
      isChanged={-> true}
      onCancel={hide}>

      <div className='select-reading-modal'>
        {chapters}
      </div>
    </Dialog>

  render: ->
    
    <LoadableItem
      id={@props.courseId}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderDialog}
    />


module.exports = SelectTopics
