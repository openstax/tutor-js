React = require 'react'
_ = require 'underscore'

ContactUsLink = React.createClass

  propTypes:
    message: React.PropTypes.string
    product: React.PropTypes.string

  getDefaultProps: ->
    message: "contact us."
    product: null

  getUrl: ->
    "http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3A#{@props.product}&q\"

  render: -> <a href={@getUrl()}>{@props.message}</a>


module.exports = ContactUsLink
