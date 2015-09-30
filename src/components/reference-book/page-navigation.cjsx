React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Router = require 'react-router'

ChapterSectionMixin = require '../chapter-section-mixin'

PageNavigation = React.createClass

  mixins: [ ChapterSectionMixin ]

  propTypes:
    onPageNavigationClick: React.PropTypes.func
    direction: React.PropTypes.string.isRequired
    pageNavRouterLinkTarget: React.PropTypes.string.isRequired
    enabled: React.PropTypes.bool.isRequired
    section: React.PropTypes.string

  contextTypes:
    router: React.PropTypes.func

  onClick: (ev) ->
    @props.onPageNavigationClick?(@props.section, ev)

  render: ->
    return null unless @props.enabled and @props.section

    params = _.extend({}, @context.router.getCurrentParams(), section: @props.section)

    <Router.Link className={classnames('page-navigation', @props.direction)}
      to={@props.pageNavRouterLinkTarget}
      query={@context.router.getCurrentQuery()}
      onClick={@onClick}
      params={params}>
      <div className='triangle' />
    </Router.Link>

module.exports = PageNavigation
