React = require 'react'
_ = require 'underscore'

Wrapper = require './wrapper'

SingleDropdown = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    label:   React.PropTypes.string.isRequired
    prefix:  React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired


  updateTag: (ev) ->
    @props.actions.setPrefixedTag(@props.id,
      tag: ev.target.value, prefix: @props.prefix, replaceOthers: true
    )

  render: ->
    tag = _.first(@props.store.getTagsWithPrefix(@props.id, @props.prefix)) or ''

    <Wrapper label={@props.label} singleTag={true}>
      <div className="tag">
        <select className='form-control' onChange={@updateTag} value={tag}>
          {unless tag # a tag cannot be blank once it's set
            <option key='blank' value=''>{name}</option>}
          {for tag, name of @props.choices
            <option key={tag} value={tag}>{name}</option>}
        </select>
      </div>
    </Wrapper>

module.exports = SingleDropdown
