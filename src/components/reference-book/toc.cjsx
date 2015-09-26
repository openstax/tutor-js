React = require 'react'
Router = require 'react-router'
_  = require 'underscore'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
ChapterSectionMixin = require '../chapter-section-mixin'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  mixins: [ChapterSectionMixin]
  propTypes:
    section: React.PropTypes.object.isRequired
    activeSection: React.PropTypes.string.isRequired
    onMenuSelection: React.PropTypes.func.isRequired
    routeLinkTarget: React.PropTypes.string

  getDefaultProps: ->
    routeLinkTarget: 'viewReferenceBookSection'

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    @setState(skipZeros: false)

  render: ->
    {activeSection} = @props
    section = @sectionFormat(@props.section.chapter_section)

    className = if section is activeSection then 'active' else ''
    params = _.extend({}, @context.router.getCurrentParams(), {section: section})

    <ul className="section" data-depth={@props.section.chapter_section.length}>
      <li data-section={section}>
        <Router.Link
          params={params}
          className={className}
          onClick={@props.onMenuSelection}
          to={@props.routeLinkTarget}
          query={@context.router.getCurrentQuery()}
        >
          <span className="section-number">{section}</span>
          {@props.section.title}
        </Router.Link>
      </li>
      { _.map @props.section.children, (child) =>
        <li key={child.id} data-section={@sectionFormat(child.chapter_section)}>
          <Section
            activeSection={activeSection}
            onMenuSelection={@props.onMenuSelection}
            section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  mixins: [ChapterSectionMixin]
  propTypes:
    onMenuSelection: React.PropTypes.func.isRequired
    activeSection:   React.PropTypes.string.isRequired

  componentWillMount: ->
    @setState(skipZeros: false)
  componentDidMount:  -> @scrollSelectionIntoView()
  componentDidUpdate: -> @scrollSelectionIntoView()
  scrollSelectionIntoView: ->
    {section} = @props
    return unless section
    section = @sectionFormat(section)

    root = React.findDOMNode(@)
    li = root.querySelector("[data-section='#{section}']")
    return unless li

    beforeTop = li.offsetTop - root.offsetTop < root.scrollTop
    pastBottom = (li.offsetTop - root.offsetTop + li.clientHeight) >
      (root.scrollTop + root.clientHeight)
    li.scrollIntoView() if beforeTop or pastBottom


  render: ->
    {activeSection, ecosystemId, query} = @props
    toc = ReferenceBookStore.getToc(ecosystemId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section
          query={query}
          activeSection={activeSection}
          onMenuSelection={@props.onMenuSelection}
          key={child.id}
          section={child} /> }
    </div>
