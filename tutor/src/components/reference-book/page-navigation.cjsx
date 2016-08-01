React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
Router = require 'react-router'

PageNavigation = React.createClass

  propTypes:
    ecosystemId: React.PropTypes.string.isRequired
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

    params = _.extend({ecosystemId: @props.ecosystemId}, @context.router.getCurrentParams(), section: @props.section)

    <Router.Link className={classnames('page-navigation', @props.direction)}
      to={@props.pageNavRouterLinkTarget}
      query={@context.router.getCurrentQuery()}
      onClick={@onClick}
      params={params}>
      <div className='triangle' />
    </Router.Link>

module.exports = PageNavigation
