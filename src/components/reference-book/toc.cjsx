React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

Section = React.createClass
  displayName: 'ReferenceBookTocSection'
  mixins: [ Router.State ]
  propTypes:
    section: React.PropTypes.object.isRequired
    onClick: React.PropTypes.func

  render: ->
    {courseId} = @getParams()
    title = if @props.section.cnx_id
      # FIXME - talk to BE about either breaking apart the uid and version,
      # or the endpoint should accept the compete string when retrieving a page
      link = _.first( @props.section.cnx_id.split('@') )
      <Router.Link onClick={@props.onClick} to="viewReferenceBookPage"
          params={courseId: courseId, cnxId: link}>
          <span className="section-number">
            {@props.section.chapter_section.join('.')}
          </span>
          {@props.section.title}
      </Router.Link>
    else
      <h3>
        <span className="section-number">{_.first @props.section.chapter_section}</span>
        {@props.section.title}
      </h3>

    <ul className="section">
      {title}
      { _.map @props.section.children, (child) =>
        <li key={child.id}>
          <Section onClick={@props.onClick} section={child} />
        </li> }
    </ul>


module.exports = React.createClass
  displayName: 'ReferenceBookTOC'
  mixins: [ Router.State ]
  propTypes:
    onClick: React.PropTypes.func

  render: ->
    {courseId} = @getParams()
    toc = ReferenceBookStore.getToc(courseId)
    <div className="toc">
      { _.map toc.children, (child) =>
        <Section onClick={@props.onClick} key={child.id} section={child} /> }
    </div>
