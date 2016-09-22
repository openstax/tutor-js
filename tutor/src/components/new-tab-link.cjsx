React = require 'react'
_ = require 'underscore'
{Link} = require 'react-router'
NewTabLink = React.createClass
  displayName: 'NewTabLink'

  contextTypes:
    router: React.PropTypes.object

  getDefaultProps: ->
    target: '_blank'

  propTypes:
    to: React.PropTypes.string.isRequired
    children: React.PropTypes.node.isRequired
    params: React.PropTypes.object
    query: React.PropTypes.object
    target: React.PropTypes.string

  getLinkProps: (link) ->
    linkProps =
      href: link

    # most props should transfer, such as onClick, className, etc.
    transferProps = _.omit(@props, ['to', 'params', 'query', 'children', 'bsStyle'])
    _.extend({}, transferProps, linkProps)

  render: ->
    {to, params, query, children} = @props

    linkProps = @getLinkProps(to)

    <Link to={to} {...linkProps}>{children}</Link>

module.exports = NewTabLink
