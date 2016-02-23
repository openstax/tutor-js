React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
ChapterSection = require './task-plan/chapter-section'
BrowseTheBook = require './buttons/browse-the-book'

{TocStore, TocActions} = require '../flux/toc'

{CourseStore} = require '../flux/course'

SectionTopic = React.createClass
  displayName: 'SectionTopic'

  propTypes:
    # planId: React.PropTypes.string.isRequired
    section: React.PropTypes.object.isRequired
    active: React.PropTypes.bool

  getInitialState: ->
    active: @props.active

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
    @setState(active: !@state.active)
#    section = @props.section

    # if (TaskPlanStore.hasTopic(@props.planId, section.id))
    #   TaskPlanActions.removeTopic(@props.planId, section.id)
    # else
    #   TaskPlanActions.addTopic(@props.planId, section.id)

ChapterAccordion = React.createClass
  displayName: 'ChapterAccordion'

  propTypes:
#    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    chapter: React.PropTypes.object.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array
    expanded: React.PropTypes.bool

  renderSections: (section) ->
    active = true #TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} />

  areAllSectionsSelected: (allSelected, section) ->
    @props.selected.indexOf(section.id) >= 0 and allSelected

  toggleAllSections: (e) ->
    # if e.target.checked
    #   action = TaskPlanActions.addTopic
    # else
    #   action = TaskPlanActions.removeTopic

    # planId = @props.planId
    # _.each @props.chapter.children, (section) ->
    #   action(planId, section.id)

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
      <h2 className={chapterClass.join(' ')} data-chapter-section={chapter.chapter_section[0]}>
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


ChapterSectionChooser = React.createClass
  propTypes:
    ecosystemId: React.PropTypes.string
    courseId: React.PropTypes.string
    selected: React.PropTypes.arrayOf(
      React.PropTypes.shape( #
        sectionId: React.PropTypes.string
      )
    )

  getDefaultProps: ->
    selections: []

  getEcosystemId: ->
    @props.ecosystemId or CourseStore.get(@props.courseId)?.ecosystem_id or (
      throw new Error("BUG: ecosystemId wasn't provided and unable to find it on course")
    )

  renderChapters: ->
    <div className="chapter-section-chooser">
    {for chapter in TocStore.get(@getEcosystemId())
      console.log chapter
      <ChapterAccordion key={chapter.id} {...@props} chapter={chapter} />}
    </div>


  render: ->
    <LoadableItem
      id={@getEcosystemId()}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderChapters}
    />


module.exports = ChapterSectionChooser
