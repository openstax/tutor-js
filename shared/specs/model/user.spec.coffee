{Testing, expect, sinon, _} = require 'shared/specs/helpers'

URLs = require 'model/urls'
User = require 'model/user'
UiSettings = require 'model/ui-settings'
Networking = require 'model/networking'

describe 'User mode', ->
  user = null

  beforeEach ->
    sinon.spy(Networking, 'perform')
    URLs.update(accounts_api_url: 'http://localhost:2999/api')
    user = new User(contact_infos: [
      {id: 1234, is_verified: false}
    ])

  afterEach ->
    UiSettings._reset()
    Networking.perform.restore()

  it 'can request email confirmation', ->
    email = _.first user.unVerfiedEmails()
    expect(email).to.exist
    email.sendConfirmation()
    expect(Networking.perform).to.have.been.calledWith({
      method: 'PUT',
      url: 'http://localhost:2999/api/contact_infos/1234/resend_confirmation.json',
      silenceErrors: true,
      withCredentials: true, data: {send_pin: true}
    })
    undefined

  it 'can send an email confirmation', ->
    email = _.first user.unVerfiedEmails()
    email.sendVerification("1234")
    expect(Networking.perform).to.have.been.calledWith({
      method: 'PUT', url: 'http://localhost:2999/api/contact_infos/1234/confirm_by_pin.json',
      silenceErrors: true,
      withCredentials: true, data: { pin: "1234" }
    })
    undefined
