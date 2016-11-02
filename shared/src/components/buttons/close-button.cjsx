React = require 'react'
classnames = require 'classnames'

OXLink = require '../../factories/link'

module.exports = React.createClass
  render: ->
    classNames = classnames 'openstax-close-x', 'close', @props.className
    <button {...OXLink.filterProps(@props)} className={classNames} aria-role='close'></button>
