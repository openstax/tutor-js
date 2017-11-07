React = require 'react'
{Link} = require 'react-router-dom'
concat = require 'lodash/concat'
qs = require 'qs'
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
      className: React.PropTypes.string
      primaryBtn:  React.PropTypes.bool

    render: ->
      {to, params, query, primaryBtn, className = ''} = @props

      if primaryBtn
        className += ' btn btn-default btn-primary'

      pathname = router.makePathname(to, params)

      to =
        pathname: pathname or to
      if query
        to.search = qs.stringify(query)

      # TODO see about isActive
      <Link to={to} {...filterProps(@props)} className={className} />

module.exports = {make, filterProps}
