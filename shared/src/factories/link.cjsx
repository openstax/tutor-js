React = require 'react'
{Link} = require 'react-router-dom'
concat    = require 'lodash/concat'

{filterProps} = require '../helpers/react'
filterPropsBase = filterProps

LINK_PROPS = [
  'alt', 'title', 'activeOnlyWhenExact', 'activeStyle', 'activeClassName', 'isActive', 'location', 'disabled'
]

filterProps = (props, options = {}) ->
  options.props = concat(LINK_PROPS, options.props or [])
  filterPropsBase(props, options)

make = (router, name = 'OpenStax') ->
  React.createClass
    displayName: "#{name}Link"
    propTypes:
      to:     React.PropTypes.string.isRequired
      params: React.PropTypes.object
      query:  React.PropTypes.object
    render: ->
      {to, params, query} = @props

      pathname = router.makePathname(to, params)

      to =
        pathname: pathname or to
        query: query

      # TODO see about isActive
      <Link to={to} {...filterProps(@props)} />

module.exports = {make, filterProps}
