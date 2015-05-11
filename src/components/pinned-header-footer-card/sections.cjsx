React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

PinnedHeader = React.createClass
  displayName: 'PinnedHeader'

  propTypes:
    className: React.PropTypes.string

  render: ->
    {className} = @props
    classes = 'pinned-header'
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
    </div>

PinnableFooter = React.createClass
  displayName: 'PinnableFooter'

  propTypes:
    className: React.PropTypes.string
    pinned: React.PropTypes.bool.isRequired

  getDefaultProps: ->
    pinned: true

  render: ->
    {className, pinned} = @props
    classPrefix = if pinned then 'pinned' else 'card'
    classes = "#{classPrefix}-footer"
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
    </div>

CardBody = React.createClass
  displayName: 'CardBody'

  propTypes:
    className: React.PropTypes.string
    footerClassName: React.PropTypes.string
    pinned: React.PropTypes.bool.isRequired

  getDefaultProps: ->
    pinned: true

  render: ->
    {className, pinned, footerClassName} = @props
    classes = 'card-body'
    classes += " #{className}" if className?

    <div className={classes}>
      {@props.children}
      <PinnableFooter pinned={pinned} className={footerClassName}>
        {@props.footer}
      </PinnableFooter>
    </div>

module.exports = {PinnedHeader, CardBody, PinnableFooter}
