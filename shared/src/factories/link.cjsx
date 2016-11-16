React = require 'react'
{Link} = require 'react-router'
concat    = require 'lodash/concat'

{filterProps} = require '../helpers/react'
filterPropsBase = filterProps

LINK_PROPS = [
  'alt', 'title', 'activeOnlyWhenExact', 'activeStyle', 'activeClassName', 'isActive', 'location', 
]

filterProps = (props, options = {}) ->
  filterPropsBase(props, concat(LINK_PROPS, options.props or []))

make = (router, name = 'OpenStax') ->
  React.createClass
    displayName: "#{name}Link"
    render: ->
      {to, params, query} = @props

      pathname = router.makePathname(to, params)

      to =
        pathname: pathname or to
        query: query

      # TODO see about isActive
      <Link to={to} {...filterProps(@props)} />

module.exports = {make, filterProps}
