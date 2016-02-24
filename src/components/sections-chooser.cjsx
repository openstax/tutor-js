React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
ChapterSection = require './task-plan/chapter-section'
BrowseTheBook = require './buttons/browse-the-book'
TriStateCheckbox = require './tri-state-checkbox'
classnames = require 'classnames'

{TocStore, TocActions} = require '../flux/toc'

{CourseStore} = require '../flux/course'

SectionTopic = React.createClass

  propTypes:
    section: React.PropTypes.shape(
      id: React.PropTypes.string
      title: React.PropTypes.string
      chapter_section: React.PropTypes.array
    ).isRequired
    selections: React.PropTypes.object.isRequired
    onChange: React.PropTypes.func.isRequired

  isSelected: -> @props.selections[@props.section.id]

  toggleSection: ->
    @props.onChange({"#{@props.section.id}": not @isSelected()})

  render: ->
    classNames = classnames 'section', {selected: @props.selected}
    <div key={@props.section.id} className={classNames} onClick={@toggleSection}>
      <span className='section-checkbox'>
        <input type='checkbox' readOnly checked={'checked' if @isSelected()} />
      </span>
      <ChapterSection section={@props.section.chapter_section}/>
      <span className='-section-title'> {@props.section.title}</span>
    </div>

ChapterAccordion = React.createClass

  propTypes:
    onChange: React.PropTypes.func.isRequired
    chapter: React.PropTypes.shape(
      id: React.PropTypes.string
      title: React.PropTypes.string
      chapter_section: React.PropTypes.array
      children: React.PropTypes.array
    ).isRequired

  contextTypes:
    router: React.PropTypes.func

  browseBook: (ev) -> ev.stopPropagation() # stop click from toggling the accordian
  isSectionSelected: (section) -> @props.selections[section.id]
  toggleSections: (ev, iconState) ->
    newSelections = {}
    ev.stopPropagation()
    newSelections[section.id] = not isSectionSelected(section) for section in chapter.children
    @onChange(newSelections)


  renderHeader: ->
    {chapter, ecosystemId} = @props
    selected = _.filter chapter.children, @isSectionSelected
    checkBoxType = if selected.length is chapter.children.length then 'checked'
    else if selected.length then 'partial'
    else 'unchecked'

    classNames = classnames 'chapter-heading', 'empty-chapter': _.isEmpty(chapter.children)

    <h2 className={classNames} data-chapter-section={chapter.chapter_section[0]}>

      <span className='chapter-checkbox'>
        <TriStateCheckbox
          type={checkBoxType}
          onClick={@toggleSections} />
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

  render: ->
    {chapter, expanded} = @props

#    activeKey = chapter.id if expanded # or _.any chapter.children, @isSectionSelected

    <BS.Accordion activeKey={@expanded}>
      <BS.Panel key={chapter.id} header={@renderHeader()} eventKey={chapter.id}>
      {for section in chapter.children
        <SectionTopic key={section.id} {...@props} section={section} />}
      </BS.Panel>
    </BS.Accordion>


SectionsChooser = React.createClass
  propTypes:
    ecosystemId: React.PropTypes.string
    courseId: React.PropTypes.string
    onSelectionChange: React.PropTypes.func.isRequired
    selectedSections: React.PropTypes.arrayOf(
      React.PropTypes.string
    )

  getInitialState: -> {selections: {}}

  componentWillMount: ->
    @copySelectionStateFromProps(
      if @props.selectedSections then @props.selectedSections else []
    )

  componentWillReceiveProps: (nextProps) ->
    @copySelectionStateFrom(nextProps.selectedSections) if nextProps.selectedSections

  copySelectionStateFromProps: (selections) ->
    selections = {}
    for sectionId in selections
      selections[sectionId]
    @setState({selections})

  getEcosystemId: ->
    @props.ecosystemId or CourseStore.get(@props.courseId)?.ecosystem_id or (
      throw new Error("BUG: ecosystemId wasn't provided and unable to find it on course")
    )

  getSelectedSectionIds: (selections = @state.selections) ->
    sectionId for sectionId, value of selections when value

  onSectionSelectionChange: (update) ->
    selections = _.extend({}, @state.selections, update)
    console.log selections
    @setState({selections})
    @props.onSelectionChange?( @getSelectedSectionIds(selections) )

  renderChapters: ->
    <div className="sections-chooser">
    {for chapter in TocStore.get(@getEcosystemId())
      <ChapterAccordion key={chapter.id} {...@props}
        onChange={@onSectionSelectionChange}
        selections={@state.selections} chapter={chapter} />}
    </div>

  render: ->
    <LoadableItem
      id={@getEcosystemId()}
      store={TocStore}
      actions={TocActions}
      renderItem={@renderChapters}
    />


module.exports = SectionsChooser
