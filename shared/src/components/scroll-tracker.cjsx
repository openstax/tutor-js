React = require 'react'
_ = require 'underscore'

ScrollListenerMixin = require 'react-scroll-components'
GetPositionMixin = require './get-position-mixin'

ScrollTrackerMixin =
  mixins: [GetPositionMixin]
  propTypes:
    setScrollPoint: React.PropTypes.func.isRequired
    unsetScrollPoint: React.PropTypes.func
    scrollState: React.PropTypes.object.isRequired

  getInitialState: ->
    scrollPoint: 0

  setScrollPoint: ->
    {setScrollPoint, scrollState} = @props

    scrollPoint = @getTopPosition(@getDOMNode())
    @setState({scrollPoint})

    setScrollPoint(scrollPoint, scrollState)

  unsetScrollPoint: ->
    {unsetScrollPoint} = @props
    unsetScrollPoint?(@state.scrollPoint)

  componentDidMount: ->
    @setScrollPoint()

  componentWillUnmount: ->
    @unsetScrollPoint()

ScrollTracker = React.createClass
  displayName: 'ScrollTracker'
  mixins: [ScrollTrackerMixin]
  render: ->
    @props.children

ScrollTrackerParentMixin =

  getInitialState: ->
    scrollPoints: []
    scrollState: {}
    scrollTopBuffer: 0

  setScrollTopBuffer: ->
    scrollTopBuffer = GetPositionMixin.getTopPosition(@getDOMNode())
    @setState({scrollTopBuffer})

  setScrollPoint: (scrollPoint, scrollState) ->
    scrollPointData = _.extend({scrollPoint: scrollPoint}, scrollState)
    @state.scrollPoints.push(scrollPointData)
    @sortScrollPoints()

  unsetScrollPoint: (unsetScrollPoint) ->
    @state.scrollPoints = _.reject @state.scrollPoints, (scrollPoint) ->
      scrollPoint.scrollPoint is unsetScrollPoint
    @sortScrollPoints()

  sortScrollPoints: ->
    sortedDescScrollPoints = _.sortBy @state.scrollPoints, (scrollData) ->
      -1 * scrollData.scrollPoint

    @setState({scrollPoints: sortedDescScrollPoints})

  getScrollStateByScroll: (scrollTop) ->
    scrollState = _.find @state.scrollPoints, (scrollData) =>
      scrollTop > (scrollData.scrollPoint - @state.scrollTopBuffer - 2)

    scrollState or _.last(@state.scrollPoints)

  areKeysSame: (key, keyToCompare) ->
    key is keyToCompare or parseInt(key) is parseInt(keyToCompare)

  getScrollStateByKey: (stepKey) ->
    scrollStateIndex = _.findLastIndex @state.scrollPoints, (scrollData) =>
      @areKeysSame(scrollData.key, stepKey)

    @state.scrollPoints[scrollStateIndex]

  setScrollState: ->
    scrollState = @getScrollStateByScroll(@state.scrollTop)
    @setState({scrollState})

    @props.setScrollState(scrollState)

  isScrollPointsStable: (compareState) ->
    _.isEqual(@state.scrollPoints, compareState.scrollPoints)

  shouldCheckForScrollingState: (state) ->
    state ?= @state
    not _.isEmpty(state.scrollPoints) and not _.isUndefined(state.scrollState) and @isScrollPointsStable(state)

  componentDidMount: ->
    @setScrollTopBuffer()
    @scrollToKey(@props.currentStep) if @props.currentStep?

  componentWillUpdate: (nextProps, nextState) ->
    return unless @shouldCheckForScrollingState(nextState)
    willScrollStateKeyChange = not @areKeysSame(nextState.scrollState.key, @state.scrollState.key)
    @props.goToStep(nextState.scrollState.key) if willScrollStateKeyChange

  componentDidUpdate: (prevProps, prevState) ->
    return unless @shouldCheckForScrollingState(prevState)
    doesScrollStateMatch = @areKeysSame(prevState.scrollState.key, @getScrollStateByScroll(@state.scrollTop)?.key)
    didCurrentStepChange = not @areKeysSame(@props.currentStep, prevState.scrollState?.key)

    unless doesScrollStateMatch
      @setScrollState()
    else if didCurrentStepChange
      @scrollToKey(@props.currentStep)

  scrollToKey: (stepKey) ->
    return unless stepKey?
    scrollState = @getScrollStateByKey(stepKey)
    return unless scrollState?
    window.scrollTo(0, (scrollState?.scrollPoint - @state.scrollTopBuffer))

module.exports = {ScrollTrackerMixin, ScrollTracker, ScrollTrackerParentMixin}
