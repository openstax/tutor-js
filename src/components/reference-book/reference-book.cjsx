React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

Leaf = React.createClass
  displayName: 'ReferenceBookTocLeaf'
  mixins: [ Router.State ]
  propTypes:
    branch: React.PropTypes.object.isRequired

  render: ->
    {courseId} = @getParams()
    title = if @props.branch.cnx_id
      # FIXME - talk to BE about either breaking apart the uid and version,
      # or the endpoint should accept the compete string when retrieving a page
      link = _.first( @props.branch.cnx_id.split('@') )
      <Router.Link to="viewReferenceBookPage"
          params={courseId: courseId, cnxId: link}>
          {@props.branch.title}
      </Router.Link>
    else
      <h3>{@props.branch.title}</h3>

    <ul className="leaf">
      {title}
      { _.map @props.branch.children, (child) ->
        <li key={child.id}><Leaf branch={child} /></li> }
    </ul>

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [ Router.State ]

  render: ->
    {courseId} = @getParams()
    toc = ReferenceBookStore.getToc(courseId)
    console.dir toc
    <div className="reference-book">
      <div className="menu">
        <h1>{toc.title}</h1>
        { _.map toc.children, (child) ->
          <Leaf key={child.id} branch={child} /> }
      </div>
      <Router.RouteHandler courseId={courseId} />
    </div>
