React = require 'react'

{EcosystemsStore} = require '../../flux/ecosystems'
{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
ReferenceBook = require '../reference-book/reference-book'
LoadableItem = require '../loadable-item'

ReferenceBookWrapper = React.createClass

  propTypes:
    id: React.PropTypes.number.isRequired

  renderBook: ->
    id = "#{@props.id}"
    section = ReferenceBookStore.getFirstSection(id)
    <ReferenceBook section={section} ecosystemId={id} />

  render: ->
    id = "#{@props.id}"

    <LoadableItem
      id={id}
      store={ReferenceBookStore}
      actions={ReferenceBookActions}
      renderItem={@renderBook}
    />



module.exports = ReferenceBookWrapper
