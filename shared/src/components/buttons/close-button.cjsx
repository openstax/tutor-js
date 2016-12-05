React = require 'react'
classnames = require 'classnames'

OXLink = require '../../factories/link'

CloseButton = (props) ->
  render: ->
    classNames = classnames 'openstax-close-x', 'close', props.className
    <button
      {...OXLink.filterProps(props)}
      className={classNames}
    ></button>

module.exports = CloseButton
