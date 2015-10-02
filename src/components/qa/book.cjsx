React = require 'react'

{EcosystemsStore} = require '../../flux/ecosystems'

LoadableItem = require '../loadable-item'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
ReferenceBookWrapper = require './reference-book-wrapper'

Book = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    book = EcosystemsStore.getBook(id: parseInt(courseId, 10))

    <div>
      <h3>{book.title}</h3>

      <LoadableItem
        id={courseId}
        store={ReferenceBookStore}
        actions={ReferenceBookActions}
        renderItem={ -> <ReferenceBookWrapper {...book} /> }
      />
    </div>

module.exports = Book
