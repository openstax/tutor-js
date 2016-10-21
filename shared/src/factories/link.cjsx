React = require 'react'
{Link} = require 'react-router'

indexOf = require 'lodash/indexOf'
pickBy  = require 'lodash/pickBy'
concat  = require 'lodash/concat'
some    = require 'lodash/some'

PASSABLE_PROPS = [
  'className', 'id', 'children', 'target', 'activeOnlyWhenExact',
  'activeStyle', 'activeClassName', 'isActive', 'location', 'ref',
  'tabIndex', 'alt', 'title', 'role'
]

PASSABLE_PREFIXES = ['data-', 'aria-', 'on']

filterProps = (props, options = {}) ->
  pickBy props, (prop, name) ->

    indexOf(concat(PASSABLE_PROPS, options.props or []), name) > -1 or
      some(concat(PASSABLE_PREFIXES, options.prefixes or []), (prefix) ->
        name.indexOf(prefix) is 0
      )

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
