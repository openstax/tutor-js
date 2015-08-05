React = require 'react'
BS = require 'react-bootstrap'
ReferenceBookTOC = require './toc'

module.exports = React.createClass
  displayName: 'SlideOutMenu'
  propTypes:
    onMenuSelection: React.PropTypes.func.isRequired


  render: ->
    <div className='menu'>
      <ReferenceBookTOC {...@props} visible={@props.visible} />
    </div>
