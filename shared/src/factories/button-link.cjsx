React = require 'react'
{Link} = require 'react-router'
concat    = require 'lodash/concat'
BS = require 'react-bootstrap'

{filterProps} = require '../helpers/react'
filterPropsBase = filterProps

BUTTON_LINK_PROPS = [
  'alt', 'title', 'active', 'type', 'block', 'componentClass', 'disabled'
]

BUTTON_LINK_PREFIXES = [
  'bs'
]

filterProps = (props, options = {}) ->
  options.props = concat(BUTTON_LINK_PROPS, options.props or [])
  options.prefixes = concat(BUTTON_LINK_PREFIXES, options.prefixes or [])
  filterPropsBase(props, options)

make = (router, name = 'OpenStax') ->
  React.createClass
    displayName: "#{name}ButtonLink"

    getInitialState: ->
      fullPathname: @makeFullPathname()

    componentWillReceiveProps: (nextProps) ->
      @setState(fullPathname: @makeFullPathname(nextProps))

    makeFullPathname: (props) ->
      props ?= @props
      {to, params, query} = props
      router.makePathname(to, params, {query})

    goToPathname: (clickEvent) ->
      clickEvent.preventDefault()
      router.transitionTo(@state.fullPathname)

    render: ->
      {fullPathname} = @state

      <BS.Button href={fullPathname} onClick={@goToPathname} {...filterProps(@props)} />

module.exports = {make, filterProps}
