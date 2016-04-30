_ = require 'underscore'
axios = require 'axios'
URLs = require './urls'
class Email

  constructor: (attrs) ->
    _.extend(@, attrs)

  verify: (pin) ->
    axios(
      method: 'PUT'
      baseURL: URLs.get('base_accounts')
      url: "/api/contact_infos/#{@id}/confirm_by_pin.json"
      withCredentials: true
      data: {pin}
    )


class User

  @current: ->
    return @_current_user

  @setCurrent: (data) ->
    @_current_user = new User(data)

  constructor: (data) ->
    @attibutes = data
    @emails = _.map @attibutes.contact_infos, (ci) -> new Email(ci)

  unVerfiedEmails: ->
    _.where @emails, is_verified: false

module.exports = User
