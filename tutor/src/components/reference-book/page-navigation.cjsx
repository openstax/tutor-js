_     = require 'underscore'
BS    = require 'react-bootstrap'
React = require 'react'

classnames = require 'classnames'
Router = require 'react-router'

PagingNavigation = require '../paging-navigation'
{ReferenceBookStore} = require '../../flux/reference-book'
{ChapterSectionMixin} = require 'shared'

ReferenceViewPageNavigation = React.createClass

  propTypes:
    pageNavRouterLinkTarget: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    section: React.PropTypes.string
    cnxId: React.PropTypes.string
    onPageNavigationClick: React.PropTypes.func

  mixins: [ChapterSectionMixin]

  contextTypes:
    router: React.PropTypes.func

  onNavigation: (info, href) ->
    @props.onPageNavigationClick?(info.chapter_section, ev)
    @context.router.transitionTo(href)

  render: ->

    pageInfo = ReferenceBookStore.getPageInfo(@props) or {}
    params = _.extend({ecosystemId: @props.ecosystemId}, @context.router.getCurrentParams())

    if pageInfo.next
      nextUrl = @context.router.makeHref( @props.pageNavRouterLinkTarget,
        _.extend({}, params, section: @sectionFormat(pageInfo.next.chapter_section))
        @context.router.getCurrentQuery()
      )

    if pageInfo.prev
      prevUrl = @context.router.makeHref( @props.pageNavRouterLinkTarget,
        _.extend({}, params, section: @sectionFormat(pageInfo.prev.chapter_section)),
        @context.router.getCurrentQuery()
      )

    <PagingNavigation
      className="reference-book-page"
      onForwardNavigation={_.partial(@onNavigation, pageInfo.next)}
      onBackwardNavigation={_.partial(@onNavigation, pageInfo.prev)}
      isForwardEnabled={nextUrl?}
      forwardHref={nextUrl}
      isBackwardEnabled={prevUrl?}
      backwardHref={prevUrl}
    >
      {@props.children}
    </PagingNavigation>

module.exports = ReferenceViewPageNavigation
