_ = require 'underscore'
Networking = require './networking'
URLs = require './urls'
EventEmitter2 = require 'eventemitter2'

ERROR_CODES =
  pin_not_correct: 'Invalid PIN code'
  no_pin_confirmation_attempts_remaining: 'Too many PIN attempts'

class Email extends EventEmitter2

  constructor: (@user, attrs) ->
    super()
    _.extend(@, attrs)

  sendVerification: (pin, successCallBack) ->
    @makeRequest('confirm_by_pin', {pin}).then (resp) =>
      if resp.status is 204
        delete @error
        @is_verified = true
        successCallBack(@)
      else
        code = _.first(resp.data?.errors)?.code
        @error = ERROR_CODES[code]
        if code is 'no_pin_confirmation_attempts_remaining'
          @verificationFailed = true
      @emit('change')


  sendConfirmation: ->
    @makeRequest('resend_confirmation', {send_pin: true}).then (resp) =>
      @verifyInProgress = (resp.status is 204)
      @emit('change')

  makeRequest: (type, data = {}) ->
    @requestInProgress = true

    afterRequest = (resp) =>
      @requestInProgress = false
      @emit('change')
      resp
    Networking.perform(
      method: 'PUT',
      url: URLs.construct('accounts_api', "contact_infos", @id, "#{type}.json")
      withCredentials: true
      data: data
    ).catch(afterRequest).then(afterRequest)

class User extends EventEmitter2

  @current: ->
    return @_current_user

  @setCurrent: (data) ->
    @_current_user = new User(data)

  constructor: (data) ->
    super()
    @attibutes = data
    @emails = _.map @attibutes.contact_infos, (ci) => new Email(@, ci)

  unVerfiedEmails: ->
    _.where @emails, is_verified: false

module.exports = User
