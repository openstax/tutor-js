React = require 'react'
BS = require 'react-bootstrap'

{TaskActions} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'
{CardBody} = require '../pinned-header-footer-card/sections'
_ = require 'underscore'

module.exports =

  getInitialState: ->
    classNames: ['task-step']

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
    <CardBody className={@state.classNames.join(' ')} footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>

  componentDidMount:  -> @setBannerClass()
  componentDidUpdate: -> @setBannerClass()

  # If the rendered content has a matching element that will be used as the banner,
  # add a "with-ui-banner" css class.  This way the component can be styled to match
  setBannerClass: ->
    has_banner = _.contains(@state.classNames, "with-ui-banner")
    if not has_banner and this.getDOMNode().querySelector(":first-child[data-label]")
      @setState classNames: @state.classNames.concat ["with-ui-banner"]
