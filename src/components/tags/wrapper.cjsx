React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

TagWrapper = React.createClass

  propTypes:
    label: React.PropTypes.string.isRequired

  render: ->
    <BS.Col sm=3 className={classnames('tag-type', 'has-error': @props.error)}>

      <div className="heading">
        <span className="label">{@props.label}</span>
        <div className="controls">
          {if @props.onAdd
            <i onClick={@props.onAdd} className="fa fa-plus-circle" />}
        </div>
      </div>

      {@props.children}

    </BS.Col>


module.exports = TagWrapper
