React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'
{ Link } = require 'react-router'

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

    path = "#{@props.pageNavRouterLinkTarget}#{@props.section}"

    <Link className={classnames('page-navigation', @props.direction)}
      to={path}
      query={@context.router.getCurrentQuery()}
      onClick={@onClick}
    >
      <div className='triangle' />
    </Link>

module.exports = PageNavigation
