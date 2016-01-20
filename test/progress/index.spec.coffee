React = require 'react'
{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

Collection = require 'task/collection'
{Progress} = require 'progress'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'

Wrapper = React.createClass
  childContextTypes:
    moduleUUID:     React.PropTypes.string
    collectionUUID: React.PropTypes.string

  getChildContext: ->
    _.pick @props, 'moduleUUID', 'collectionUUID'

  render: ->
    React.createElement(Progress, @props)

describe 'Progress Component', ->

  beforeEach ->
    @props =
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'

    Collection.load("#{@props.collectionUUID}/#{@props.moduleUUID}", _.extend({}, TASK, @props))

  # Note. somethings wrong with the format of the task.  It doesn't render the title text from it
  it 'renders status', ->
    Testing.renderComponent(Wrapper, props: @props).then ({dom, element}) ->
      expect(dom.querySelector('.concept-coach-progress-page-title')).not.to.be.null
