React = require 'react'

# TODO find a better pluralizer
pluralize = require 'pluralize'
pluralize.addPluralRule('it', 'them')

module.exports = React.createClass
  displayName: 'Pluralize'
  propTypes:
    items: React.PropTypes.array.isRequired
    children: React.PropTypes.string.isRequired

  getDefaultProps: ->
    items: []

  render: ->
    {items} = @props
    <span>{pluralize(@props.children, items.length)}</span>
