React = require 'react'
BS = require 'react-bootstrap'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

LoadableItem = require '../loadable-item'
moment = require 'moment'
ReferenceBook = require './reference-book'
ReferenceBookPage = require './page'

ReferenceBookShell = React.createClass
  displayName: 'ReferenceBookShell'

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className='reference-book'>
      <LoadableItem
        id={courseId}
        store={ReferenceBookStore}
        actions={ReferenceBookActions}
        renderItem={ -> <ReferenceBook courseId={courseId}/> }
      />
    </div>

module.exports = {ReferenceBookShell, ReferenceBookPage}
