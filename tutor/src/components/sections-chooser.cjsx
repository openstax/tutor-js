React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

ChapterSection = require './task-plan/chapter-section'
BrowseTheBook = require './buttons/browse-the-book'
TriStateCheckbox = require './tri-state-checkbox'
classnames = require 'classnames'

SectionTopic = React.createClass

  propTypes:
    section: React.PropTypes.shape(
      id: React.PropTypes.string
      title: React.PropTypes.string
      chapter_section: React.PropTypes.array
    ).isRequired
    selections: React.PropTypes.object.isRequired
    onChange: React.PropTypes.func.isRequired

  isSelected:    -> !!@props.selections[@props.section.id]
  toggleSection: -> @props.onChange({"#{@props.section.id}": not @isSelected()})
  render: ->
    classNames = classnames 'section', {selected: @isSelected()}
    <div key={@props.section.id} className={classNames} onClick={@toggleSection}>
      <span className='section-checkbox'>
        <input type='checkbox' readOnly checked={@isSelected()} />
      </span>
      <ChapterSection section={@props.section.chapter_section}/>
      <span className='-section-title'> {@props.section.title}</span>
    </div>

ChapterAccordion = React.createClass

  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
    onChange: React.PropTypes.func.isRequired
    chapter: React.PropTypes.shape(
      id: React.PropTypes.string
      title: React.PropTypes.string
      chapter_section: React.PropTypes.array
      children: React.PropTypes.array
    ).isRequired

  getInitialState: ->
    {expanded: @isAnySelected() or 1 is _.first @props.chapter.chapter_section}
  browseBook: (ev)              -> ev.stopPropagation() # stop click from toggling the accordian
  isSectionSelected: (section)  -> @props.selections[section.id]
  isAnySelected:                -> _.any @props.chapter.children, @isSectionSelected
  toggleSectionSelections: (ev) ->
    ev.stopPropagation()
    ev.preventDefault()
    selected = not @isAnySelected()
    newSelections = {}
    newSelections[section.id] = selected for section in @props.chapter.children
    @setState({expanded: true})
    @props.onChange(newSelections)

  renderHeader: ->
    {chapter, ecosystemId} = @props
    selected = _.filter chapter.children, @isSectionSelected

    checkBoxType = if selected.length is chapter.children.length then 'checked'
    else if selected.length then 'partial' else 'unchecked'

    classNames = classnames 'chapter-heading', 'empty-chapter': _.isEmpty(chapter.children)

    <div className={classNames}  data-chapter-section={chapter.chapter_section[0]}>
      <span className='chapter-checkbox'>
        <TriStateCheckbox type={checkBoxType} onClick={@toggleSectionSelections} />
      </span>
      <span className='chapter-number'>
        Chapter <ChapterSection section={chapter.chapter_section}/> -
      </span>
      <span className='chapter-title'> {chapter.title}</span>

      <BrowseTheBook
        ecosystemId={ecosystemId} unstyled={true}
        onClick={@browseBook} className='browse-book'
        section={chapter.chapter_section.join('.')}
      >
          Browse this Chapter
      </BrowseTheBook>
    </div>

  onAccordianToggle: ->
    @setState(expanded: not @state.expanded)

  render: ->
    {chapter} = @props
    <BS.Accordion
      expanded={@state.expanded}
      onSelect={@onAccordianToggle}
      activeKey={if @state.expanded then chapter.id else ''}
    >
      <BS.Panel key={chapter.id}
        header={@renderHeader()}
        eventKey={chapter.id}>
      {for section in chapter.children
        <SectionTopic key={section.cnx_id} {...@props} section={section} />}
      </BS.Panel>
    </BS.Accordion>


SectionsChooser = React.createClass
  displayName: 'SectionsChooser'
  propTypes:
    onSelectionChange: React.PropTypes.func
    ecosystemId: React.PropTypes.string.isRequired
    chapters: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        id: React.PropTypes.string
        title: React.PropTypes.string
        chapter_section: React.PropTypes.array
        children: React.PropTypes.array
      )
    ).isRequired
    selectedSectionIds: React.PropTypes.arrayOf(
      React.PropTypes.string
    )

  getInitialState: -> {selections: {}}

  componentWillMount: ->
    @copySelectionStateFrom(
      if @props.selectedSectionIds then @props.selectedSectionIds else []
    )

  componentWillReceiveProps: (nextProps) ->
    @copySelectionStateFrom(nextProps.selectedSectionIds) if nextProps.selectedSectionIds?

  copySelectionStateFrom: (sectionIds) ->
    selections = {}
    selections[id] = true for id in sectionIds
    @setState({selections})

  getSelectedSectionIds: (selections = @state.selections) ->
    sectionId for sectionId, value of selections when value

  onSectionSelectionChange: (update) ->
    selections = _.extend({}, @state.selections, update)
    @setState({selections})
    @props.onSelectionChange?( @getSelectedSectionIds(selections) )


  render: ->
    <div className="sections-chooser">
      {for chapter in @props.chapters
        <ChapterAccordion key={chapter.id} {...@props}
          onChange={@onSectionSelectionChange}
          selections={@state.selections} chapter={chapter} />}
    </div>



module.exports = SectionsChooser
