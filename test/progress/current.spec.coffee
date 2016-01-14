React = require 'react'
{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

Collection = require 'task/collection'
{CurrentProgress} = require 'progress/current'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'

Wrapper = React.createClass
  childContextTypes:
    moduleUUID:     React.PropTypes.string
    collectionUUID: React.PropTypes.string

  getChildContext: ->
    _.pick @props, 'moduleUUID', 'collectionUUID'

  render: ->
    React.createElement(CurrentProgress, @props)

describe 'CurrentProgress Component', ->

  beforeEach ->
    @props =
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    Collection.load("#{@props.collectionUUID}/#{@props.moduleUUID}", _.extend({}, TASK, @props))

  # Needs update to 'openstax-react-components/resize-listener
  # Currently it calls getDomNode inside a _.defer.
  # When a complete spec run is ongoing, the component is unmounted when it's called
  xit 'renders status', ->
    Testing.renderComponent(Wrapper, props: @props).then ({dom, element}) ->
      expect(dom.querySelector('.concept-coach-progress-page-title')).not.to.be.null
