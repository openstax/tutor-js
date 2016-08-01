React = require 'react'

Wrapper = require './wrapper'

BookSelection = require './book-selection'

BookTagSelect = React.createClass
  propTypes:
    book: React.PropTypes.string.isRequired
    id: React.PropTypes.string.isRequired

  updateTag: (ev) ->
    @props.actions.setPrefixedTag(@props.id,
      prefix: 'book', tag: ev.target.value, previous: @props.book
    )

  onDelete: ->
    @props.actions.setPrefixedTag(@props.id,
      prefix: 'book', tag: false, previous: @props.book
    )
    @props.actions.setPrefixedTag(@props.id,
      prefix: "exid:#{@props.book}", tag: false, replaceOthers: true
    )

  render: ->
    <div className="tag">
      <BookSelection onChange={@updateTag} selected={@props.book} />
      <span className="controls">
        <i onClick={@onDelete} className="fa fa-trash" />
      </span>
    </div>

BookTags = React.createClass

  propTypes:
    id: React.PropTypes.string.isRequired
    store: React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  add: ->
    @props.actions.addBlankPrefixedTag(@props.id,
      prefix: 'book'
    )

  render: ->
    tags = @props.store.getTagsWithPrefix(@props.id, 'book')
    <Wrapper label="Book" onAdd={@add}  singleTag={tags.length is 1}>
      {for tag in tags
        <BookTagSelect key={tag} {...@props} book={tag} />}
    </Wrapper>


module.exports = BookTags
