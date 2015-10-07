React = require 'react'
classnames = require 'classnames'

SpyModeContent = React.createClass

  propTypes:
    className: React.PropTypes.string

  render: ->
    <div className={classnames('visible-when-debugging', @props.className)}>
      {@props.children}
    </div>

module.exports = SpyModeContent
