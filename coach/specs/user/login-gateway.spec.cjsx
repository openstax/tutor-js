React = require 'react'
SnapShot = require 'react-test-renderer'

jest.mock('../../src/user/model')
User = require '../../src/user/model'

FakeWindow = require 'shared/specs/helpers/fake-window'

LoginGateway = require 'user/login-gateway'

describe 'User login gateway component', ->
  beforeEach ->
    User.endpoints = {login: 'test-login'}
    @props =
      loginType: 'profile'
      onLogin: jest.fn()
      windowImpl: new FakeWindow()

  it 'calls callback when complete', ->
    wrapper = shallow(<LoginGateway {...@props}><span>Child</span></LoginGateway>)
    expect(wrapper.text()).to.include('reopen window')
    wrapper.find('a').simulate('click')
    expect(SnapShot.create(<LoginGateway {...@props} />).toJSON()).toMatchSnapshot()
    @props.windowImpl.addEventListener.lastCall.args[1](
      data: '{"user":{"id":1}}'
    )
    expect(@props.onLogin).toHaveBeenCalled()
    undefined

  it 'opens a propup window when clicked', ->
    wrapper = shallow(<LoginGateway {...@props} />)
    wrapper.find('a').simulate('click')
    expect(@props.windowImpl.open).to.have.been.calledWith(
        sinon.match(/test-login\?parent=.*/),
        'oxlogin',
        sinon.match(/toolbar=no,location=yes,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=\d+,height=\d+,top=\d+,left=\d+/)
      )
    undefined
