React = require 'react'
_ = require 'underscore'

NewTabLink = React.createClass
  displayName: 'NewTabLink'

  contextTypes:
    router: React.PropTypes.func

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
    transferProps = _.omit(@props, ['to', 'params', 'query', 'children'])
    _.extend({}, transferProps, linkProps)

  render: ->
    {to, params, query, children} = @props
    link = @context.router.makeHref(to, params, query)
    linkProps = @getLinkProps(link)

    <a {...linkProps}>{children}</a>

module.exports = NewTabLink
