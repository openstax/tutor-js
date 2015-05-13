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

  componentDidMount:  ->
    @setBannerClass()

  setBannerClass: ->
    has_banner = _.contains(@state.classNames, "with-ui-banner")
    if not has_banner and this.getDOMNode().querySelector(":first-child[data-label]")
      # The defer's needed to break out of the rendering loop so the store has time to
      # mark itself as loaded
      # TODO: investigate why
      _.delay =>
        @setState classNames: @state.classNames.concat ["with-ui-banner"] if @isMounted()
      , 20
