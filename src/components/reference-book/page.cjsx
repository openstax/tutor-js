React = require 'react'
Router = require 'react-router'

BS = require 'react-bootstrap'
HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
BookContentMixin = require '../book-content-mixin'

{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../flux/reference-book-page'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'

  mixins: [Router.State]
  getSplashTitle: ->
    {cnxId} = @getParams()
    page = ReferenceBookPageStore.get(cnxId)
    page?.title

  render: ->
    {cnxId} = @getParams()
    page = ReferenceBookPageStore.get(cnxId)
    return null unless page
    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')
    <div className="page">
      <ArbitraryHtmlAndMath block html={html} />
    </div>
