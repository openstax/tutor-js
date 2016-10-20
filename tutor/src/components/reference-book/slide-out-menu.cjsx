React = require 'react'
ReactDOM = require 'react-dom'
TutorLink = require '../link'
_  = require 'underscore'

Router = require '../../helpers/router'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
{ChapterSectionMixin} = require 'shared'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  mixins: [ChapterSectionMixin]
  propTypes:
    isOpen: React.PropTypes.bool.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    section: React.PropTypes.object.isRequired
    activeSection: React.PropTypes.string.isRequired
    onMenuSelection: React.PropTypes.func.isRequired
    menuRouterLinkTarget: React.PropTypes.string.isRequired

  componentWillMount: ->
    @setState(skipZeros: false)

  render: ->
    {activeSection} = @props
    section = @sectionFormat(@props.section.chapter_section)

    className = if section is activeSection then 'active' else ''
    params = _.extend({ecosystemId: @props.ecosystemId}, Router.currentParams(), {section: section})

    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <li data-section={section}>
        <TutorLink
          tabIndex={if @props.isOpen then 0 else -1}
          params={params}
          className={className}
          onClick={_.partial(@props.onMenuSelection, section)}
          to={@props.menuRouterLinkTarget}
          query={Router.currentQuery()} >

          <span className="section-number">{section}</span>
          {@props.section.title}
        </TutorLink>
      </li>
      { _.map @props.section.children, (child) =>
        <li key={child.id} data-section={@sectionFormat(child.chapter_section)}>
          <Section
            {...@props}
            activeSection={activeSection}
            section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  mixins: [ChapterSectionMixin]
  propTypes:
    onMenuSelection: React.PropTypes.func.isRequired
    activeSection:   React.PropTypes.string.isRequired
    isOpen:          React.PropTypes.bool.isRequired

  componentWillMount: ->
    @setState(skipZeros: false)
  componentDidMount:  -> @scrollSelectionIntoView()
  componentDidUpdate: -> @scrollSelectionIntoView()
  scrollSelectionIntoView: ->
    {section} = @props
    return unless section
    section = @sectionFormat(section)

    root = ReactDOM.findDOMNode(@)
    li = root.querySelector("[data-section='#{section}']")
    return unless li

    beforeTop = li.offsetTop - root.offsetTop < root.scrollTop
    pastBottom = (li.offsetTop - root.offsetTop + li.clientHeight) >
      (root.scrollTop + root.clientHeight)
    li.scrollIntoView() if beforeTop or pastBottom


  render: ->
    {activeSection, ecosystemId, query} = @props
    toc = ReferenceBookStore.getToc(ecosystemId)
    return null if not toc?

    <div className="menu">
      { _.map toc.children, (child) =>
        <Section
          {...@props}
          query={query}
          activeSection={activeSection}
          key={child.id}
          section={child} /> }
    </div>
