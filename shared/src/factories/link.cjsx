React = require 'react'
{Link} = require 'react-router'
forEach = require 'lodash/forEach'
indexOf = require 'lodash/indexOf'
isObject = require 'lodash/isObject'
pick = require 'lodash/pick'

PASSABLE_PROPS = [
  'className', 'id', 'children', 'activeOnlyWhenExact',
  'activeStyle', 'activeClassName', 'isActive', 'location', 'ref'
]

makeLink = (router, name = 'OpenStax') ->
  React.createClass
    displayName: "#{name}Link"
    render: ->
      {to, params, query} = @props

      linkProps = {}

      forEach(@props, (prop, name) ->
        if indexOf(name, 'data-') is 0 or
          indexOf(name, 'on') is 0 or
          indexOf(PASSABLE_PROPS, name) > -1
            linkProps[name] = prop
      )

      if params?
        pathname = to.pathname or to
        toPathname = router.makePathname(pathname, params)

        if isObject(to)
          to.pathname = toPathname
        else
          to = toPathname

      # TODO see about isActive
      <Link to={to} {...linkProps} />

module.exports = makeLink
