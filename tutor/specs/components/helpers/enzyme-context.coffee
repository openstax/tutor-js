React       = require 'react'
extend      = require 'lodash/extend'
TestBackend = require 'react-dnd-test-backend'
{DragDropManager} = require 'dnd-core'


EnzymeContext =

  withDnD: (options = {}) ->
    extend({
      context:
        dragDropManager: new DragDropManager(TestBackend)
        router: {}
      childContextTypes:
        dragDropManager: React.PropTypes.object
        router: React.PropTypes.object
    }, options)

module.exports = EnzymeContext
