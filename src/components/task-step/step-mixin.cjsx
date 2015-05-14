React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

LoadableItem = require '../loadable-item'
{CardBody} = require '../pinned-header-footer-card/sections'

module.exports =

  renderGenericFooter: ->
    buttonClasses = '-continue'
    buttonClasses += ' disabled' unless @isContinueEnabled()
    continueButton = <BS.Button
      bsStyle='primary'
      className={buttonClasses}
      onClick={@onContinue}>Continue</BS.Button>

    {continueButton}

  render: ->
    footer = @renderFooterButtons?() or @renderGenericFooter()
    {pinned} = @props
    classNames = 'task-step'
    classNames += ' tutor-ui-banner' if @state?.hasBanner
    <CardBody className={classNames} footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>

  componentDidMount:  -> @setBannerClass()
  componentDidUpdate: -> @setBannerClass()

  # If the rendered content has a matching element that will be used as the banner,
  # add a "with-ui-banner" css class.  This way the component can be styled to match
  setBannerClass: ->
    bannerMissing = not @state?.hasBanner
    if bannerMissing and this.getDOMNode().querySelector(".note:first-child[data-has-label]")
      @setState hasBanner: true
