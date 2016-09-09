React = require 'react'
_ = require 'underscore'

BOOKS =
  'stax-soc'     : 'Sociology'
  'stax-phys'    : 'College Physics'
  'stax-k12phys' : 'Physics',
  'stax-bio'     : 'Biology'
  'stax-apbio'   : 'Biology for AP® Courses'
  'stax-cbio'    : 'Concepts of Biology'
  'stax-econ'    : 'Economics'
  'stax-anp'     : 'Anatomy and Physiology'
  'stax-macro'   : 'Macro Economics'
  'stax-micro'   : 'Micro Economics'

BookSelection = React.createClass

  propTypes:
    onChange: React.PropTypes.func
    selected: React.PropTypes.string
    limit: React.PropTypes.array

  render: ->
    books = if @props.limit
      _.pick(BOOKS, @props.limit)
    else
      BOOKS
    <select
      className='form-control'
      onChange={@props.onChange} value={@props.selected}
    >
      {if _.isEmpty(@props.selected)
        <option key='blank' value={''}></option>}
      {for tag, name of books
        <option key={tag} value={tag}>{name}</option>}
    </select>


module.exports = BookSelection
