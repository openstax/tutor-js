React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Dialog = require '../dialog'
BrowseTheBook = require '../buttons/browse-the-book'
LoadableItem = require '../loadable-item'
{TocStore, TocActions} = require '../../flux/toc'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
ChapterSection = require './chapter-section'
{CourseStore} = require '../../flux/course'

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
      <ChapterSection section={@props.section.chapter_section}/>
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
    expanded: React.PropTypes.bool

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

  contextTypes:
    router: React.PropTypes.func

  areAnySectionsSelected: (anySelected, section) ->
    @props.selected.indexOf(section.id) >= 0 or anySelected

  browseBook: (ev) ->
    ev.stopPropagation() # stop click from toggling the accordian

  render: ->
    {chapter, expanded, ecosystemId} = @props
    sections = _.map(chapter.children, @renderSections)
    allChecked = _.reduce(chapter.children, @areAllSectionsSelected, true) and chapter.children?.length
    expandAccordion = _.reduce(chapter.children, @areAnySectionsSelected, false) or expanded

    activeKey = chapter.id if expandAccordion
    chapterClass = ["chapter-heading"]

    if (not chapter.children?.length)
      chapterClass.push('empty-chapter')

    header =
      <h2 className={chapterClass.join(' ')}>
        <span className='chapter-checkbox'>
          <input type='checkbox' id="chapter-checkbox-#{chapter.id}"
            onChange={@toggleAllSections} checked={allChecked}/>
        </span>
        <span className='chapter-number'>
          Chapter <ChapterSection section={chapter.chapter_section}/> -
        </span>
        <span className='chapter-title'> {chapter.title}</span>
        <BrowseTheBook
          onClick={@browseBook}
          className='browse-book'
          section={chapter.chapter_section.join('.')}
          ecosystemId={ecosystemId}
          unstyled={true}>
            Browse this Chapter
        </BrowseTheBook>
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
    expanded = not @props.selected?.length and i is 0
    <ChapterAccordion {...@props} expanded={expanded} chapter={chapter}/>

  renderDialog: ->
    {courseId, planId, selected, hide, header, primary, cancel} = @props

    selected = TaskPlanStore.getTopics(planId)
    chapters = _.map(TocStore.get(), @renderChapterPanels)

    <Dialog
      className='select-reading-dialog'
      header={header}
      primary={primary}
      confirmMsg='Are you sure you want to close?'
      cancel='Cancel'
      isChanged={-> true}
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
