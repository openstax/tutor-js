React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
BookContentMixin = require '../book-content-mixin'

{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [Router.State]
  getSplashTitle: ->
    {cnxId} = @getParams()
    page = ReferenceBookPageStore.get(cnxId)
    page?.title

  prevLink: (info) ->
    # BE Fix
    cnxId = _.first( info.prev.cnx_id.split('@') )
    <Router.Link className="nav prev" to="viewReferenceBookPage"
      params={courseId: @props.courseId, cnxId: cnxId}>
      <i className="prev fa fa-chevron-left"/>
    </Router.Link>

  nextLink: (info) ->
    # BE Fix
    cnxId = _.first( info.next.cnx_id.split('@') )
    <Router.Link className="nav next" to="viewReferenceBookPage"
      params={courseId: @props.courseId, cnxId: cnxId}>
      <i className="fa fa-chevron-right"/>
    </Router.Link>

  render: ->
    {courseId} = @getParams()
    # read the id from props, or failing that the url
    cnxId = @props.cnxId or @getParams().cnxId
    page = ReferenceBookPageStore.get(cnxId)
    info = ReferenceBookStore.getPageInfo(courseId:courseId, cnxId:cnxId)

    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')
    <div className="wrapper">
      {@prevLink(info) if info.prev}
      <div className="page">
        <ArbitraryHtmlAndMath block html={html} />
      </div>
      {@nextLink(info) if info.next}

    </div>
